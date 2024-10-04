const bcrypt = require('bcryptjs');
const User = require('../models/User');
const roomService = require('./roomService');
const { generateMessageId } = require('../utils/generators');

class SocketService {
  constructor() {
    this.users = new Map();
    this.io = null;
  }

  initializeSocket(io) {
    this.io = io;

    io.on('connection', (socket) => {
      console.log('✅ User connected:', socket.id);

      this.setupSocketHandlers(socket);
    });
  }

  setupSocketHandlers(socket) {
    socket.on('join-room', (data) => this.handleJoinRoom(socket, data));
    socket.on('send-message', (data) => this.handleSendMessage(socket, data));
    socket.on('typing-start', (data) => this.handleTypingStart(socket, data));
    socket.on('typing-stop', (data) => this.handleTypingStop(socket, data));
    socket.on('react-to-message', (data) => this.handleReaction(socket, data));
    socket.on('delete-message', (data) => this.handleDeleteMessage(socket, data));
    socket.on('edit-message', (data) => this.handleEditMessage(socket, data));
    socket.on('disconnect', () => this.handleDisconnect(socket));
    socket.on('error', (error) => this.handleError(socket, error));
  }

  async handleJoinRoom(socket, data) {
    try {
      const { roomCode, username, password, avatar } = data;
      
      const room = roomService.getRoom(roomCode);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, room.password);
      if (!isValidPassword) {
        socket.emit('error', { message: 'Invalid room code or password' });
        return;
      }

      // Leave any previous rooms
      await this.leavePreviousRooms(socket, username);

      // Join new room
      socket.join(roomCode);
      
      const user = new User(socket.id, username, avatar);
      user.currentRoom = roomCode;

      // Add user to room
      room.addUser(user);
      
      // Store user data
      this.users.set(socket.id, user);

      // Send room data to user
      socket.emit('room-joined', {
        room: room.toJSON(),
        user: user.toJSON(),
        users: room.users.map(u => u.toJSON()),
        messages: room.messages.slice(-50),
        roomPassword: password
      });

      // Notify others
      socket.to(roomCode).emit('user-joined', {
        user: user.toJSON(),
        message: `${username} joined the room`
      });
      
      socket.to(roomCode).emit('users-update', room.users.map(u => u.toJSON()));
      
      console.log(`👥 ${username} joined room ${roomCode}. Total users: ${room.users.length}`);

    } catch (error) {
      console.error('❌ Error joining room:', error);
      socket.emit('error', { message: error.message || 'Failed to join room' });
    }
  }

  async leavePreviousRooms(socket, username) {
    socket.rooms.forEach(roomId => {
      if (roomId !== socket.id) {
        socket.leave(roomId);
        const prevRoom = roomService.getRoom(roomId);
        if (prevRoom) {
          prevRoom.removeUser(socket.id);
          socket.to(roomId).emit('users-update', prevRoom.users.map(u => u.toJSON()));
          socket.to(roomId).emit('user-left', { 
            id: socket.id, 
            username: username,
            message: `${username} left the room`
          });
        }
      }
    });
  }

  handleSendMessage(socket, data) {
    try {
      const { roomCode, message, type = 'text' } = data;
      const user = this.users.get(socket.id);
      
      if (!user || !roomService.roomExists(roomCode)) return;

      const room = roomService.getRoom(roomCode);
      const messageData = {
        id: generateMessageId(),
        userId: socket.id,
        username: user.username,
        avatar: user.avatar,
        message: message,
        type: type,
        timestamp: new Date().toISOString(),
        reactions: {}
      };

      room.addMessage(messageData);

      // Broadcast message to room
      this.io.to(roomCode).emit('new-message', messageData);
      
      console.log(`💬 Message sent in ${roomCode} by ${user.username}`);

    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  }

  handleTypingStart(socket, data) {
    this.handleTyping(socket, data, true);
  }

  handleTypingStop(socket, data) {
    this.handleTyping(socket, data, false);
  }

  handleTyping(socket, data, isTyping) {
    try {
      const { roomCode } = data;
      const user = this.users.get(socket.id);
      
      if (user && roomService.roomExists(roomCode)) {
        const room = roomService.getRoom(roomCode);
        const userInRoom = room.getUser(socket.id);
        
        if (userInRoom && room.settings.allowTypingIndicators) {
          userInRoom.isTyping = isTyping;
          socket.to(roomCode).emit('user-typing', {
            userId: socket.id,
            username: user.username,
            isTyping: isTyping
          });
        }
      }
    } catch (error) {
      console.error('❌ Typing error:', error);
    }
  }

  handleReaction(socket, data) {
    try {
      const { roomCode, messageId, reaction } = data;
      const user = this.users.get(socket.id);
      
      if (!user || !roomService.roomExists(roomCode)) return;

      const room = roomService.getRoom(roomCode);
      const message = room.getMessage(messageId);
      
      if (message) {
        if (!message.reactions[reaction]) {
          message.reactions[reaction] = [];
        }
        
        // Remove user's previous reaction to this message
        Object.keys(message.reactions).forEach(r => {
          message.reactions[r] = message.reactions[r].filter(u => u !== user.username);
        });
        
        // Add new reaction
        if (!message.reactions[reaction].includes(user.username)) {
          message.reactions[reaction].push(user.username);
        }
        
        this.io.to(roomCode).emit('message-reaction', {
          messageId,
          reactions: message.reactions
        });
      }
    } catch (error) {
      console.error('❌ Reaction error:', error);
    }
  }

  handleDeleteMessage(socket, data) {
    try {
      const { roomCode, messageId } = data;
      const user = this.users.get(socket.id);
      const room = roomService.getRoom(roomCode);
      
      if (!room || !user) return;
      
      const message = room.getMessage(messageId);
      if (message && (user.username === room.host || message.userId === socket.id)) {
        room.messages = room.messages.filter(m => m.id !== messageId);
        this.io.to(roomCode).emit('message-deleted', { messageId });
      }
    } catch (error) {
      console.error('❌ Delete message error:', error);
    }
  }

  handleEditMessage(socket, data) {
    try {
      const { roomCode, messageId, newMessage } = data;
      const user = this.users.get(socket.id);
      const room = roomService.getRoom(roomCode);
      
      if (!room || !user) return;
      
      const message = room.getMessage(messageId);
      if (message && message.userId === socket.id) {
        message.message = newMessage;
        message.edited = true;
        message.editedAt = new Date().toISOString();
        
        this.io.to(roomCode).emit('message-edited', {
          messageId,
          newMessage,
          editedAt: message.editedAt
        });
        
        console.log(`✏️ Message edited in ${roomCode} by ${user.username}`);
      }
    } catch (error) {
      console.error('❌ Edit message error:', error);
    }
  }

  handleDisconnect(socket) {
    console.log('❌ User disconnected:', socket.id);
    
    const user = this.users.get(socket.id);
    if (user && user.currentRoom) {
      const room = roomService.getRoom(user.currentRoom);
      if (room) {
        room.removeUser(socket.id);
        
        // Notify room
        socket.to(user.currentRoom).emit('user-left', {
          id: socket.id,
          username: user.username,
          message: `${user.username} left the room`
        });
        
        socket.to(user.currentRoom).emit('users-update', room.users.map(u => u.toJSON()));
        
        console.log(`👋 ${user.username} left room ${user.currentRoom}`);
        
        // Clean up empty rooms
        roomService.cleanupEmptyRooms();
      }
    }
    
    this.users.delete(socket.id);
  }

  handleError(socket, error) {
    console.error('💥 Socket error:', error);
  }
}

module.exports = new SocketService();