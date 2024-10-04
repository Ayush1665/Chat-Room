const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Import configurations and routes
const socketConfig = require('./config/socket');
const roomRoutes = require('./routes/roomRoutes');
const healthRoutes = require('./routes/healthRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api', healthRoutes);

// Socket.io configuration
socketConfig(server);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});