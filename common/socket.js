import io from './uni-socket.io.js';

const socketIo = io('http://139.155.33.218:5555', {
	query: {},
	transports: [ 'websocket', 'polling' ],
	timeout: 5000,
});

export default socketIo
