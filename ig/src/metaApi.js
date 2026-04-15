const { igApiVersion, igAccessToken, igAccountId, fbPageId } = require('./config');

const sendText = async (to, text) => {
  // For Instagram DM via Messenger platform, sending from the connected Facebook Page
  // endpoint is accepted reliably across app setups.
  const endpointId = fbPageId || igAccountId;
  const url = `https://graph.facebook.com/${igApiVersion}/${endpointId}/messages`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${igAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipient: { id: String(to) },
      messaging_type: 'RESPONSE',
      message: { text: String(text || '') },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`IG send failed: ${response.status} ${body}`);
  }
};

module.exports = { sendText };
