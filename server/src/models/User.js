class User {
  constructor(socketId, username, avatar, currentRoom = null) {
    this.id = socketId;
    this.username = username;
    this.avatar = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;
    this.color = this.getRandomColor();
    this.isOnline = true;
    this.joinedAt = new Date().toISOString();
    this.isTyping = false;
    this.currentRoom = currentRoom;
  }

  getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      avatar: this.avatar,
      color: this.color,
      isOnline: this.isOnline,
      joinedAt: this.joinedAt,
      isTyping: this.isTyping
    };
  }
}

module.exports = User;