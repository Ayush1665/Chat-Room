import React, { useRef, useEffect } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ messages, typingUsers, username, currentRoom, socket }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          username={username}
          currentRoom={currentRoom}
          socket={socket}
        />
      ))}
      
      {typingUsers.length > 0 && (
        <TypingIndicator typingUsers={typingUsers} />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;