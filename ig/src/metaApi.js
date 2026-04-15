const { igApiVersion, igAccessToken, igAccountId } = require('./config');

const sendText = async (to, text) => {
  const url = `https://graph.facebook.com/${igApiVersion}/${igAccountId}/messages`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${igAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipient: { id: String(to) },
      message: { text: String(text || '') },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`IG send failed: ${response.status} ${body}`);
  }
};

module.exports = { sendText };
