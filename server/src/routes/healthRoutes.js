const express = require('express');
const roomService = require('../services/roomService');
const socketService = require('../services/socketService');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    totalRooms: roomService.rooms.size,
    totalUsers: socketService.users.size,
    timestamp: new Date().toISOString() 
  });
});

module.exports = router;