const { waApiVersion, waAccessToken, waPhoneNumberId } = require('./config');

const sendText = async (to, text) => {
  const url = `https://graph.facebook.com/${waApiVersion}/${waPhoneNumberId}/messages`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${waAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`WA send failed: ${response.status} ${body}`);
  }
};

module.exports = { sendText };
