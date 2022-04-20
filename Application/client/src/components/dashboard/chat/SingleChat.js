import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FormControl, Input } from '@mui/material';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import './styles/styles.css';
import io from 'socket.io-client';

import { Modal } from '@mui/material';
import MeetingSelector from '../meeting/MeetingSelector';
import { TextField } from '@mui/material';

//Variable value will change on deployment
const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({
	auth: { user },
	selectedChat,
	avails: { otherAvails },
}) => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState('');
	const [socketConnected, setSocketConnected] = useState(false);

	const getSender = (loggedUser, users) => {
		return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
	};

	const fetchMessages = async () => {
		if (!selectedChat) {
			return;
		}

		try {
			setLoading(true);

			const { data } = await axios.get(
				`/api/message/${selectedChat._id}`
			);

			setMessages(data);
			setLoading(false);

			socket.emit('join chat', selectedChat._id);
		} catch (error) {
			console.log(error);
		}
	};

	const sendMessage = async (event) => {
		if (event.key === 'Enter' && newMessage !== '') {
			try {
				setNewMessage('');
				const { data } = await axios.post('/api/message', {
					content: newMessage,
					chatId: selectedChat._id,
				});

				socket.emit('new message', data);

				setMessages([...messages, data]);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const [meetingTitle, setMeetingTitle] = useState('');

	const updateTitle = ({ target }) => {
		setMeetingTitle(target.value);
	};

	const submitRequest = async (event) => {
		// Only send request if meetingTitle is not empty
		if (meetingTitle !== '') {
			try {
				setNewMessage('');
				console.log('Submit Request');
				const { data } = await axios.post('/api/message', {
					chatId: selectedChat._id,
					content: 'Meeting Requested',
					meetingTitle: meetingTitle,
					startDate: time,
				});

				console.log(time);

				socket.emit('new message', data);
				console.log('Socket Emited');
				setMessages([...messages, data]);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const [time, setTime] = React.useState(new Date());
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const typingHandler = (e) => {
		setNewMessage(e.target.value);
	};

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit('setup', user);
		socket.on('connection', () => setSocketConnected(true));
	}, []);

	const [update, setUpdate] = useState(false);

	useEffect(() => {
		fetchMessages();
		selectedChatCompare = selectedChat;
	}, [selectedChat, update]);

	useEffect(() => {
		socket.on('message received', (newMessageReceived) => {
			if (
				!selectedChatCompare ||
				selectedChatCompare._id !== newMessageReceived.chat._id
			) {
				// give notification
			} else {
				setMessages([...messages, newMessageReceived]);
			}
		});
	});

	return (
		<div className='chatContainer'>
			{selectedChat._id ? (
				<>
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby='modal-modal-title'
						aria-describedby='modal-modal-description'
					>
						<div className='formContainer'>
							<h2>Request a Meeting</h2>
							<br />
							<TextField
								fullWidth
								label='Reason for meeting'
								value={meetingTitle}
								onChange={updateTitle}
							/>
							<MeetingSelector
								personAvails={otherAvails}
								setTime={setTime}
								setMeetingTitle={setMeetingTitle}
								handleClose={handleClose}
								submitRequest={submitRequest}
							/>
						</div>
					</Modal>
					<button
						onClick={() => {
							// console.log(selectedChat);
							handleOpen();
						}}
					>
						Meeting
					</button>
					<h1 className='chatName'>
						{!selectedChat.isGroupChat
							? getSender(user, selectedChat.users)
							: selectedChat.chatName}
					</h1>
					<div className='sepLine'></div>
					<div className='messages'>
						<ScrollableChat
							messages={messages}
							update={update}
							setUpdate={setUpdate}
						/>
					</div>
					<FormControl
						onKeyDown={sendMessage}
						className='chatInputContainer'
					>
						<div>
							<Input
								placeholder='Enter your message here'
								onChange={typingHandler}
								className='chatInput'
								value={newMessage}
							/>
						</div>
					</FormControl>
				</>
			) : (
				<div className='noChat'>
					<span>Select a chat</span>
				</div>
			)}
		</div>
	);
};

SingleChat.prototype = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	avails: state.availability,
});

export default connect(mapStateToProps)(SingleChat);
