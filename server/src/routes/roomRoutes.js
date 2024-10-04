const express = require('express');
const roomController = require('../controllers/roomController');

const router = express.Router();

router.post('/create', roomController.createRoom);
router.post('/join', roomController.joinRoom);
router.get('/:roomCode', roomController.getRoom);
router.get('/', roomController.getAllRooms);

module.exports = router;