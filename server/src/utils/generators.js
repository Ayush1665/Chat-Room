const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const generatePassword = () => {
  return Math.random().toString(36).substring(2, 8);
};

const generateMessageId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

module.exports = {
  generateRoomCode,
  generatePassword,
  generateMessageId
};