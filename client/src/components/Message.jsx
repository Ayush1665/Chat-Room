import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

const Message = ({ message, username, currentRoom, socket }) => {
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState('');

  const deleteMessage = (messageId) => {
    if (socket && currentRoom) {
      socket.emit('delete-message', {
        roomCode: currentRoom.id,
        messageId
      });
    }
  };

  const startEditing = (message) => {
    setEditingMessage(message.id);
    setEditText(message.message);
  };

  const cancelEditing = () => {
    setEditingMessage(null);
    setEditText('');
  };

  const saveEdit = () => {
    if (!editText.trim() || !socket || !currentRoom) return;

    socket.emit('edit-message', {
      roomCode: currentRoom.id,
      messageId: editingMessage,
      newMessage: editText.trim()
    });

    setEditingMessage(null);
    setEditText('');
  };

  if (message.type === 'system') {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm">
          {message.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="bg-white rounded-2xl p-4 shadow-sm max-w-2xl hover:shadow-md transition-all group">
        <div className="flex items-center space-x-3 mb-2">
          <img
            src={message.avatar}
            alt={message.username}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold text-gray-800">{message.username}</span>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString()}
            {message.edited && <span className="ml-1 text-gray-400">(edited)</span>}
          </span>
          
          {(message.username === username || username === currentRoom?.host) && (
            <div className="ml-auto flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {message.username === username && (
                <button
                  onClick={() => startEditing(message)}
                  className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded"
                  title="Edit message"
                >
                  <FiEdit2 size={14} />
                </button>
              )}
              <button
                onClick={() => deleteMessage(message.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded"
                title="Delete message"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          )}
        </div>
        
        {editingMessage === message.id ? (
          <EditMode
            editText={editText}
            setEditText={setEditText}
            onSave={saveEdit}
            onCancel={cancelEditing}
          />
        ) : (
          <p className="text-gray-700">{message.message}</p>
        )}
      </div>
    </div>
  );
};

const EditMode = ({ editText, setEditText, onSave, onCancel }) => (
  <div className="space-y-2">
    <textarea
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 resize-none"
      rows="3"
      autoFocus
    />
    <div className="flex space-x-2">
      <button
        onClick={onSave}
        className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
      >
        <FiCheck />
        Save
      </button>
      <button
        onClick={onCancel}
        className="bg-gray-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
      >
        <FiX />
        Cancel
      </button>
    </div>
  </div>
);

export default Message;