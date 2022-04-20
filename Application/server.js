const express = require('express');
const connectDB = require('./config/db');
const { use } = require('./routes/api/users');

const app = express();

// Connect Database
connectDB();

app.get('/', (req, res) => res.send('API Running'));

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/chat', require('./routes/api/chat'));
app.use('/api/message', require('./routes/api/message'));
app.use('/api/availability', require('./routes/api/availability'));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
	console.log(`Server started on port ${PORT}`)
);

const io = require('socket.io')(server, {
	pingTimeout: 60000,
	cors: {
		origin: 'http://localhost:3000',
	},
});

io.on('connection', (socket) => {
	console.log('Connected to socket.io');

	// Creating a new Socket that will take user data from
	// client and would create a 'room'. So that each user joins their
	// own room.
	socket.on('setup', (userData) => {
		socket.join(userData._id);
		socket.emit('connected');
	});

	socket.on('join chat', (room) => {
		socket.join(room);
		console.log('User joined Room: ' + room);
	});

	socket.on('new message', (newMessageReceived) => {
		var chat = newMessageReceived.chat;
		if (!chat.users) return console.log('Chat.users not defiend');

		chat.users.forEach((user) => {
			if (user._id == newMessageReceived.sender._id) return;
			socket.in(user._id).emit('message received', newMessageReceived);
		});
	});
});
