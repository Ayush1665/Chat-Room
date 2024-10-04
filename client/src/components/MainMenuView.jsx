import React from 'react';
import { FiUsers, FiMessageSquare, FiLogOut } from 'react-icons/fi';

const MainMenuView = ({ username, onLogout, onCreateRoom, onJoinRoom }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiUsers className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome, {username}!</h1>
          <p className="text-white/80">Choose how you want to start chatting</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <button
            onClick={onCreateRoom}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 text-center group transition-all duration-300 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
          >
            <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FiMessageSquare className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Create Room</h3>
            <p className="text-white/70 text-sm">Create and invite friends</p>
          </button>

          <button
            onClick={onJoinRoom}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 text-center group transition-all duration-300 transform hover:scale-105 hover:shadow-lg backdrop-blur-sm"
          >
            <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FiUsers className="text-2xl text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Join Room</h3>
            <p className="text-white/70 text-sm">Enter a room code to join existing chat</p>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={onLogout}
            className="text-white/80 hover:text-white transition-colors text-sm flex items-center justify-center gap-2 mx-auto"
          >
            <FiLogOut />
            Not {username}? Change username
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainMenuView;