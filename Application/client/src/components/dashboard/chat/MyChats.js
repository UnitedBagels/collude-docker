import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Stack } from '@mui/material';

import { connect } from 'react-redux';

import ChatLoading from './ChatLoading';

import { useDispatch } from 'react-redux';
import { setChat } from '../../../actions/chat';

import { getOtherAvailability } from '../../../actions/availability';
import { Navigate, useNavigate } from 'react-router-dom';

const MyChats = ({ selectedChat, chats, user }) => {
	const dispatch = useDispatch();
	let navigate = useNavigate();

	const [redirect, setRedirect] = useState(false);

	const getSender = (users) => {
		return users[0]._id === user._id ? users[1].name : users[0].name;
	};

	useEffect(() => {
		if (redirect) {
			setRedirect(false);
			return navigate('/chat');
		}
	}, [redirect]);

	return (
		<div>
			<div>My Chats</div>

			<div>
				{chats &&
					chats.map((curChat) => (
						<Box
							onClick={() => {
								dispatch(setChat(curChat));
								console.log(curChat);
								dispatch(
									getOtherAvailability(curChat.groupAdmin._id)
								);

								setRedirect(true);
								//Navigate to the chat page
							}}
							cursor='pointer'
							bgcolor={
								selectedChat === curChat ? '#01303f' : '#E8E8E8'
							}
							color={selectedChat === curChat ? 'white' : 'black'}
							px={3}
							py={2}
							borderRadius='lg'
							key={curChat._id}
							className='chatItem'
						>
							<span>
								{!curChat.isGroupChat
									? getSender(curChat.users)
									: curChat.chatName}
							</span>
						</Box>
					))}
			</div>
		</div>
	);
};

const mapStateToProps = (state) => ({
	user: state.auth.user,
});

// export default MyChats;
export default connect(mapStateToProps)(MyChats);
