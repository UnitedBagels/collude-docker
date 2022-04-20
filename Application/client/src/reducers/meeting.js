import { GET_MEETINGS, CLEAR_MEETINGS } from '../actions/types';

const initialState = {
	meetings: [],
	loading: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_MEETINGS:
			return {
				...state,
				meetings: payload,
				loading: false,
			};
		case CLEAR_MEETINGS:
			return {
				...state,
				meetings: [],
				loading: false,
			};
		default:
			return state;
	}
}
