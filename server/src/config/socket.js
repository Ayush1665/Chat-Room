const socketIo = require('socket.io');
const socketService = require('../services/socketService');

const socketConfig = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  socketService.initializeSocket(io);
};

module.exports = socketConfig;