import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import UsernameView from './components/UsernameView';
import MainMenuView from './components/MainMenuView';
import CreateRoomView from './components/CreateRoomView';
import JoinRoomView from './components/JoinRoomView';
import ChatRoom from './components/ChatRoom';

function App() {
  const [currentView, setCurrentView] = useState('username'); 
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [maxUsers, setMaxUsers] = useState(10);
  const [joinError, setJoinError] = useState('');
  
  const [currentRoom, setCurrentRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  
  const socketRef = useRef(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem('chatUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setCurrentView('main');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Add all the missing handler functions
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('chatUsername', username.trim());
      setCurrentView('main');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: `${username}'s Room`,
          username: username,
          maxUsers: maxUsers
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setRoomCode(data.roomCode);
        setRoomPassword(data.password);
        initializeSocket(data.roomCode, data.password);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to create room: ' + error.message);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setJoinError('');
    
    if (!roomCode || !roomPassword) {
      setJoinError('Please enter room code and password');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: roomCode.toUpperCase(),
          password: roomPassword,
          username: username
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        initializeSocket(roomCode.toUpperCase(), roomPassword);
      } else {
        setJoinError(data.error);
      }
    } catch (error) {
      setJoinError('Failed to join room: ' + error.message);
    }
  };

  const initializeSocket = (roomCode, password) => {
    socketRef.current = io('http://localhost:3000', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      
      socketRef.current.emit('join-room', {
        roomCode: roomCode,
        username: username,
        password: password,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`
      });
    });

    socketRef.current.on('room-joined', (data) => {
      setCurrentRoom(data.room);
      setUsers(data.users);
      setMessages(data.messages);
      setCurrentView('room');
    });

    socketRef.current.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('users-update', (userList) => {
      setUsers(userList);
    });

    socketRef.current.on('user-joined', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        message: data.message,
        timestamp: new Date().toISOString()
      }]);
    });

    socketRef.current.on('user-left', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        message: data.message,
        timestamp: new Date().toISOString()
      }]);
    });

    socketRef.current.on('user-typing', (data) => {
      setTypingUsers(prev => {
        if (data.isTyping) {
          return [...prev.filter(u => u.userId !== data.userId), data];
        } else {
          return prev.filter(u => u.userId !== data.userId);
        }
      });
    });

    socketRef.current.on('message-deleted', (data) => {
      setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
    });

    socketRef.current.on('message-edited', (data) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId ? { ...msg, message: data.newMessage, edited: true } : msg
      ));
    });

    socketRef.current.on('error', (data) => {
      alert(`Error: ${data.message}`);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    setCurrentView('main');
    setCurrentRoom(null);
    setMessages([]);
    setUsers([]);
  };

  const logout = () => {
    localStorage.removeItem('chatUsername');
    setUsername('');
    setCurrentView('username');
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'username':
        return (
          <UsernameView
            username={username}
            setUsername={setUsername}
            onSubmit={handleUsernameSubmit}
          />
        );
      case 'main':
        return (
          <MainMenuView
            username={username}
            onLogout={logout}
            onCreateRoom={() => setCurrentView('create-room')}
            onJoinRoom={() => setCurrentView('join-room')}
          />
        );
      case 'create-room':
        return (
          <CreateRoomView
            maxUsers={maxUsers}
            setMaxUsers={setMaxUsers}
            onCreateRoom={handleCreateRoom}
            onBack={() => setCurrentView('main')}
          />
        );
      case 'join-room':
        return (
          <JoinRoomView
            roomCode={roomCode}
            setRoomCode={setRoomCode}
            roomPassword={roomPassword}
            setRoomPassword={setRoomPassword}
            joinError={joinError}
            onJoinRoom={handleJoinRoom}
            onBack={() => setCurrentView('main')}
          />
        );
      case 'room':
        return (
          <ChatRoom
            socket={socketRef.current}
            currentRoom={currentRoom}
            users={users}
            messages={messages}
            typingUsers={typingUsers}
            username={username}
            roomCode={roomCode}
            roomPassword={roomPassword}
            onLeaveRoom={leaveRoom}
          />
        );
      default:
        return null;
    }
  };

  return renderView();
}

export default App;