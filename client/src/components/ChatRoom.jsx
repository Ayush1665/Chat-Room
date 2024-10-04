import React from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatRoom = ({ socket, currentRoom, users, messages, typingUsers, username, roomCode, roomPassword, onLeaveRoom }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        currentRoom={currentRoom}
        users={users}
        username={username}
        roomCode={roomCode}
        roomPassword={roomPassword}
        onLeaveRoom={onLeaveRoom}
      />
      
      <div className="flex-1 flex flex-col">
        <MessageList
          messages={messages}
          typingUsers={typingUsers}
          username={username}
          currentRoom={currentRoom}
          socket={socket}
        />
        
        <MessageInput socket={socket} currentRoom={currentRoom} />
      </div>
    </div>
  );
};

export default ChatRoom;