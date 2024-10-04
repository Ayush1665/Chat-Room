import React from 'react';
import { FiSend, FiMessageSquare } from 'react-icons/fi';

const UsernameView = ({ username, setUsername, onSubmit }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiMessageSquare className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">ChatVerse</h1>
          <p className="text-white/80">Enter your username to start chatting</p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
              placeholder="Enter your username..."
              maxLength={20}
              autoFocus
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full bg-white text-purple-600 py-3 rounded-xl font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Continue to Chat
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameView;