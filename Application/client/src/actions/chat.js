import axios from 'axios';

import { GET_CHATS, ACCESS_CHAT } from './types';

// Get current users profile
export const getChats = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/chat');

		dispatch({
			type: GET_CHATS,
			payload: res.data,
		});
	} catch (err) {
		console.log(err);
	}
};

// Search chat
// export const searchChat = (userId) => async (dispatch) => {
// 	try {
// 		const res = await axios.get(`/api/users?search=${userId}`);

// 		dispatch({
// 			type: SEARCH_CHAT,
// 			payload: res.data,
// 		});
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

// Access chat
export const accessChat = (userId) => async (dispatch) => {
	try {
		const res = await axios.post('/api/chat', { userId });

		dispatch({
			type: ACCESS_CHAT,
			payload: res.data,
		});
	} catch (err) {
		console.log(err);
	}
};

// Set chat in global state
export const setChat = (chat) => (dispatch) => {
	dispatch({
		type: ACCESS_CHAT,
		payload: chat,
	});
};
