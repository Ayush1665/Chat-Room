const bcrypt = require('bcryptjs');
const roomService = require('../services/roomService');
const { generatePassword } = require('../utils/generators');

const roomController = {
  createRoom: async (req, res) => {
    try {
      const { roomName, username, maxUsers = 10 } = req.body;
      
      const password = generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const room = roomService.createRoom(roomName, username, maxUsers, hashedPassword);
      
      res.json({
        success: true,
        roomCode: room.id,
        password,
        room: room.toJSON()
      });
      
    } catch (error) {
      console.error('❌ Room creation error:', error);
      res.status(500).json({ success: false, error: 'Failed to create room' });
    }
  },

  joinRoom: async (req, res) => {
    try {
      const { roomCode, password, username } = req.body;
      
      const room = roomService.getRoom(roomCode);
      if (!room) {
        return res.status(404).json({ success: false, error: 'Room not found' });
      }
      
      if (room.users.length >= room.maxUsers) {
        return res.status(400).json({ success: false, error: 'Room is full' });
      }
      
      const isValidPassword = await bcrypt.compare(password, room.password);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, error: 'Invalid room code or password' });
      }
      
      res.json({
        success: true,
        room: room.toJSON()
      });
      
    } catch (error) {
      console.error('❌ Room join error:', error);
      res.status(500).json({ success: false, error: 'Failed to join room' });
    }
  },

  getRoom: (req, res) => {
    const room = roomService.getRoom(req.params.roomCode);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json(room.toJSON());
  },

  getAllRooms: (req, res) => {
    const rooms = roomService.getAllRooms();
    res.json({ rooms });
  }
};

module.exports = roomController;