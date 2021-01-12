import io from './uni-socket.io.js';

const socketIo = io('http://45.125.45.234:5555', {
	query: {},
	transports: [ 'websocket', 'polling' ],
	timeout: 5000,
});

export default socketIo
