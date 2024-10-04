const Room = require('../models/Room');
const { generateRoomCode, generatePassword } = require('../utils/generators');

class RoomService {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomName, username, maxUsers = 10, hashedPassword) {
    let roomCode;
    do {
      roomCode = generateRoomCode();
    } while (this.rooms.has(roomCode));

    const room = new Room(roomCode, roomName, username, maxUsers, hashedPassword);
    this.rooms.set(roomCode, room);
    
    return room;
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode.toUpperCase());
  }

  deleteRoom(roomCode) {
    return this.rooms.delete(roomCode);
  }

  roomExists(roomCode) {
    return this.rooms.has(roomCode.toUpperCase());
  }

  getAllRooms() {
    return Array.from(this.rooms.values()).map(room => room.toJSON());
  }

  cleanupEmptyRooms() {
    for (const [roomCode, room] of this.rooms.entries()) {
      if (room.users.length === 0) {
        setTimeout(() => {
          if (this.rooms.get(roomCode)?.users.length === 0) {
            this.rooms.delete(roomCode);
            console.log(`🧹 Room ${roomCode} cleaned up`);
          }
        }, 300000); // 5 minutes
      }
    }
  }
}

module.exports = new RoomService();