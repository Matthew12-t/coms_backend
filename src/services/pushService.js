const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

const sendExpoPush = async (messages) => {
  if (!messages.length) return [];
  const response = await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messages),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Expo push failed: ${response.status} ${text}`);
  }
  return response.json();
};

const buildMessage = (token, title, body, data = {}) => ({
  to: token,
  sound: 'default',
  title,
  body,
  data,
});

module.exports = { sendExpoPush, buildMessage };
