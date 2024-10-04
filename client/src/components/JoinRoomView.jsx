import React from 'react';
import { FiUsers } from 'react-icons/fi';

const JoinRoomView = ({ roomCode, setRoomCode, roomPassword, setRoomPassword, joinError, onJoinRoom, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-6">
          <button
            onClick={onBack}
            className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors flex items-center gap-1"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Join Room</h2>
          <p className="text-white/80">Enter room details to join</p>
        </div>

        <form onSubmit={onJoinRoom} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
              placeholder="Enter code"
              maxLength={6}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Password
            </label>
            <input
              type="password"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
              placeholder="Enter password"
              required
            />
          </div>

          {joinError && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3">
              <p className="text-red-200 text-sm">{joinError}</p>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Join Room
            <FiUsers />
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoomView;