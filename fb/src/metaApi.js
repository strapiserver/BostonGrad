const { fbApiVersion, fbAccessToken, fbPageId } = require('./config');

const sendText = async (to, text) => {
  const url = `https://graph.facebook.com/${fbApiVersion}/${fbPageId}/messages`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${fbAccessToken}`,
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
    throw new Error(`FB send failed: ${response.status} ${body}`);
  }
};

module.exports = { sendText };
