const { GraphQLClient, gql } = require('graphql-request');
const {
  strapiUrl,
  strapiAuthIdentifier,
  strapiAuthPassword,
  whatsappSocialnetworkName,
  waBooleanQuestionNames,
} = require('./config');

const LOGIN_MUTATION = gql`
  mutation Login($identifier: String!, $password: String!) {
    login(input: { identifier: $identifier, password: $password }) {
      jwt
    }
  }
`;

const LEAD_BY_ID_QUERY = gql`
  query LeadById($id: ID!) {
    lead(id: $id) {
      data {
        id
        attributes {
          name
          status
          lead_contacts(pagination: { start: 0, limit: 100 }) {
            data {
              id
              attributes {
                user_id
                username
                isBanned
                isCallForbidden
                socialnetwork {
                  data {
                    id
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const QUESTIONS_QUERY = gql`
  query Questions($locale: I18NLocaleCode) {
    questions(locale: $locale, sort: ["stage:asc", "rank:asc"], pagination: { start: 0, limit: 500 }) {
      data {
        id
        attributes {
          name
          text
          stage
          rank
          isBoolean
          isOptional
          options {
            __typename
            ... on ComponentSharedOption {
              option
            }
          }
        }
      }
    }
  }
`;

const CREATE_LEAD_CONTACT = gql`
  mutation CreateLeadContact($data: LeadContactInput!) {
    createLeadContact(data: $data) {
      data { id }
    }
  }
`;

const UPDATE_LEAD = gql`
  mutation UpdateLead($id: ID!, $data: LeadInput!) {
    updateLead(id: $id, data: $data) {
      data { id }
    }
  }
`;

const CREATE_RESPONSE = gql`
  mutation CreateResponse($data: ResponseInput!) {
    createResponse(data: $data) {
      data { id }
    }
  }
`;

let cachedJwt = null;
let cachedExpMs = 0;

const decodeExpMs = (jwt) => {
  try {
    const payloadRaw = jwt.split('.')[1];
    const json = Buffer.from(payloadRaw, 'base64').toString('utf8');
    const payload = JSON.parse(json);
    if (!payload.exp) return Date.now() + 30 * 60 * 1000;
    return payload.exp * 1000;
  } catch {
    return Date.now() + 30 * 60 * 1000;
  }
};

const getJwt = async (force = false) => {
  const now = Date.now();
  if (!force && cachedJwt && cachedExpMs - 60_000 > now) return cachedJwt;

  const anon = new GraphQLClient(strapiUrl, { timeout: 15_000 });
  const result = await anon.request(LOGIN_MUTATION, {
    identifier: strapiAuthIdentifier,
    password: strapiAuthPassword,
  });
  const jwt = result?.login?.jwt;
  if (!jwt) throw new Error('Strapi login failed: no jwt');
  cachedJwt = jwt;
  cachedExpMs = decodeExpMs(jwt);
  return jwt;
};

const requestAsService = async (query, variables) => {
  const makeClient = (jwt) =>
    new GraphQLClient(strapiUrl, {
      timeout: 20_000,
      headers: { Authorization: `Bearer ${jwt}` },
    });

  const firstJwt = await getJwt(false);
  try {
    return await makeClient(firstJwt).request(query, variables);
  } catch {
    const refreshed = await getJwt(true);
    return await makeClient(refreshed).request(query, variables);
  }
};

const getLeadById = async (id) => {
  const data = await requestAsService(LEAD_BY_ID_QUERY, { id });
  const row = data?.lead?.data;
  if (!row) return null;
  const attrs = row.attributes || {};
  const contacts = Array.isArray(attrs?.lead_contacts?.data)
    ? attrs.lead_contacts.data.map((c) => ({
        id: String(c?.id || ''),
        user_id: c?.attributes?.user_id || '',
        username: c?.attributes?.username || '',
        isBanned: Boolean(c?.attributes?.isBanned),
        isCallForbidden: Boolean(c?.attributes?.isCallForbidden),
        socialnetworkName:
          c?.attributes?.socialnetwork?.data?.attributes?.name || '',
      }))
    : [];

  return {
    id: String(row.id),
    name: attrs?.name || '',
    status: attrs?.status || '',
    contacts,
  };
};

const getQuestions = async (locale = 'ru') => {
  const data = await requestAsService(QUESTIONS_QUERY, { locale });
  const rows = Array.isArray(data?.questions?.data) ? data.questions.data : [];
  return rows.map((q) => {
    const qa = q?.attributes || {};
    const options = Array.isArray(qa.options)
      ? qa.options
          .map((o) => o?.option)
          .filter((v) => typeof v === 'string' && v.trim())
      : [];
    const name = String(qa?.name || '').trim();
    const isBooleanExplicit = qa?.isBoolean === true;
    const isBooleanFallback =
      qa?.isBoolean == null &&
      options.length === 0 &&
      waBooleanQuestionNames.includes(name.toLowerCase());
    return {
      id: String(q?.id || ''),
      name,
      text: qa?.text || name || '',
      isBoolean: isBooleanExplicit || isBooleanFallback,
      isOptional: qa?.isOptional !== false,
      options,
      stage: Number.isFinite(qa?.stage) ? qa.stage : null,
      rank: Number.isFinite(qa?.rank) ? qa.rank : null,
    };
  });
};

const ensureWhatsAppLeadContact = async ({ leadId, waUserId }) => {
  const socialData = await requestAsService(
    gql`
      query SocialByName($name: String!) {
        socialnetworks(filters: { name: { eqi: $name } }, pagination: { start: 0, limit: 1 }) {
          data {
            id
            attributes { name }
          }
        }
      }
    `,
    { name: whatsappSocialnetworkName },
  );

  const social = socialData?.socialnetworks?.data?.[0];
  if (!social?.id) throw new Error(`Socialnetwork not found: ${whatsappSocialnetworkName}`);

  const created = await requestAsService(CREATE_LEAD_CONTACT, {
    data: {
      socialnetwork: String(social.id),
      user_id: String(waUserId),
      username: '',
      isBanned: false,
      isCallForbidden: false,
    },
  });
  const contactId = created?.createLeadContact?.data?.id;
  if (!contactId) throw new Error('createLeadContact returned empty id');

  const lead = await getLeadById(leadId);
  const currentContactIds = (lead?.contacts || []).map((c) => c.id).filter(Boolean);
  const nextIds = Array.from(new Set([...currentContactIds, String(contactId)]));

  await requestAsService(UPDATE_LEAD, {
    id: leadId,
    data: {
      lead_contacts: nextIds,
      status: 'new',
    },
  });
};

const createResponse = async ({ leadId, questionId, answer }) => {
  await requestAsService(CREATE_RESPONSE, {
    data: {
      answer: String(answer || '').slice(0, 2000),
      lead: leadId,
      question: questionId,
    },
  });
};

module.exports = {
  getLeadById,
  getQuestions,
  ensureWhatsAppLeadContact,
  createResponse,
};
