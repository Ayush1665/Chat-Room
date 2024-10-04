import React, { useState } from 'react';
import { FiMessageSquare, FiLogOut, FiCopy, FiCheckCircle } from 'react-icons/fi';

const Sidebar = ({ currentRoom, users, username, roomCode, roomPassword, onLeaveRoom }) => {
  const [copiedItems, setCopiedItems] = useState({
    roomCode: false,
    roomPassword: false
  });

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopiedItems(prev => ({ ...prev, roomCode: true }));
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, roomCode: false }));
      }, 1000);
    } catch (err) {
      console.error('Failed to copy room code: ', err);
    }
  };

  const copyRoomPassword = async () => {
    try {
      await navigator.clipboard.writeText(roomPassword);
      setCopiedItems(prev => ({ ...prev, roomPassword: true }));
      setTimeout(() => {
        setCopiedItems(prev => ({ ...prev, roomPassword: false }));
      }, 1000);
    } catch (err) {
      console.error('Failed to copy room password: ', err);
    }
  };

  return (
    <div className="w-80 bg-white shadow-xl flex flex-col border-r border-gray-200">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FiMessageSquare />
            ChatVerse
          </h1>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white/90">Host:</span>
            <span className="text-sm">{currentRoom?.host}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-white/90">Room Code:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono bg-white/20 px-3 py-1 rounded-lg">{roomCode}</span>
              <button
                onClick={copyRoomCode}
                className="text-white/80 hover:text-white transition-colors"
                title="Copy room code"
              >
                {copiedItems.roomCode ? <FiCheckCircle className="text-green-400" /> : <FiCopy />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-medium text-white/90">Password:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono bg-white/20 px-3 py-1 rounded-lg">{roomPassword}</span>
              <button
                onClick={copyRoomPassword}
                className="text-white/80 hover:text-white transition-colors"
                title="Copy password"
              >
                {copiedItems.roomPassword ? <FiCheckCircle className="text-green-400" /> : <FiCopy />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Online Users ({users.length})
        </h3>
        <div className="space-y-2">
          {users.map(user => (
            <UserItem key={user.id} user={user} username={username} currentRoom={currentRoom} />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLeaveRoom}
          className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <FiLogOut />
          Leave Room
        </button>
      </div>
    </div>
  );
};

const UserItem = ({ user, username, currentRoom }) => (
  <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
    <img
      src={user.avatar}
      alt={user.username}
      className="w-10 h-10 rounded-full border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-800 truncate">
          {user.username}
        </span>
        {user.username === currentRoom?.host && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Host</span>
        )}
        {user.username === username && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
        )}
      </div>
      {user.isTyping && (
        <div className="flex items-center space-x-1 mt-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span className="text-xs text-gray-500">typing...</span>
        </div>
      )}
    </div>
  </div>
);

export default Sidebar;