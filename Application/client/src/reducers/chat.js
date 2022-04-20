import { GET_CHATS, ACCESS_CHAT, CLEAR_CHATS } from '../actions/types';

const initialState = {
	chats: [],
	chat: {},
	loading: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_CHATS:
			return {
				...state,
				chats: payload,
				loading: false,
			};
		case ACCESS_CHAT:
			return {
				...state,
				chat: payload,
				loading: false,
			};
		case CLEAR_CHATS:
			return {
				...state,
				chats: [],
				chats: {},
				loading: false,
			};
		default:
			return state;
	}
}
