import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

const CreateRoomView = ({ maxUsers, setMaxUsers, onCreateRoom, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-6">
          <button
            onClick={onBack}
            className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors flex items-center gap-1"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Create Room</h2>
          <p className="text-white/80">Set up your new chat room</p>
        </div>

        <form onSubmit={onCreateRoom} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Max Users
            </label>
            <select
              value={maxUsers}
              onChange={(e) => setMaxUsers(parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all backdrop-blur-sm"
            >
              {[5, 10, 20, 30, 50].map(num => (
                <option key={num} value={num} className="text-gray-800">{num} users</option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-white text-green-600 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Create Room
            <FiMessageSquare />
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomView;