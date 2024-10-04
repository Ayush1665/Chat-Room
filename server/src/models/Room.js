class Room {
  constructor(roomCode, roomName, username, maxUsers = 10, password) {
    this.id = roomCode;
    this.name = roomName || `Room ${roomCode}`;
    this.password = password;
    this.host = username;
    this.maxUsers = maxUsers;
    this.users = [];
    this.messages = [];
    this.createdAt = new Date().toISOString();
    this.settings = {
      allowTypingIndicators: true,
      allowFileSharing: true,
      requirePassword: true
    };
  }

  addUser(user) {
    if (this.users.length >= this.maxUsers) {
      throw new Error('Room is full');
    }
    this.users.push(user);
  }

  removeUser(userId) {
    this.users = this.users.filter(user => user.id !== userId);
  }

  addMessage(message) {
    this.messages.push(message);
    // Keep only last 100 messages
    if (this.messages.length > 100) {
      this.messages = this.messages.slice(-100);
    }
  }

  getUser(userId) {
    return this.users.find(user => user.id === userId);
  }

  getMessage(messageId) {
    return this.messages.find(message => message.id === messageId);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      host: this.host,
      maxUsers: this.maxUsers,
      userCount: this.users.length,
      createdAt: this.createdAt,
      settings: this.settings
    };
  }
}

module.exports = Room;