import {
	GET_AVAILABILITY,
	GET_OTHER_AVAILABILITY,
	AVAILABILITY_ERROR,
	CLEAR_AVAILABILITY,
	ADD_AVAILABILITY,
	ADD_AVAILABILITY_ERROR,
	REMOVE_AVAILABILITY,
	REMOVE_AVAILABILITY_ERROR,
} from '../actions/types';

const initialState = {
	availabilities: [],
	otherAvails: [],
	loading: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_AVAILABILITY:
			return {
				...state,
				availabilities: payload,
				loading: false,
			};
		case GET_OTHER_AVAILABILITY:
			return {
				...state,
				otherAvails: payload,
				loading: false,
			};
		case ADD_AVAILABILITY:
		case REMOVE_AVAILABILITY:
			return {
				...state,
				availabilities: payload,
				loading: false,
			};
		case AVAILABILITY_ERROR:
		case ADD_AVAILABILITY_ERROR:
		case REMOVE_AVAILABILITY_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
			};
		case CLEAR_AVAILABILITY:
			return {
				...state,
				availabilities: [],
				otherAvails: [],
				loading: false,
			};
		default:
			return state;
	}
}
