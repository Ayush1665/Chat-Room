import React, { useState, useRef } from 'react';
import { FiSend } from 'react-icons/fi';

const MessageInput = ({ socket, currentRoom }) => {
  const [newMessage, setNewMessage] = useState('');
  const typingTimeoutRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !currentRoom) return;

    socket.emit('send-message', {
      roomCode: currentRoom.id,
      message: newMessage.trim(),
      type: 'text'
    });

    setNewMessage('');
    stopTyping();
  };

  const handleTyping = () => {
    if (!socket || !currentRoom) return;

    socket.emit('typing-start', { roomCode: currentRoom.id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing-stop', { roomCode: currentRoom.id });
    }, 3000);
  };

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (socket && currentRoom) {
      socket.emit('typing-stop', { roomCode: currentRoom.id });
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <form onSubmit={sendMessage} className="flex space-x-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onBlur={stopTyping}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          Send
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;