// Import action types from action types js file
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
} from '../actions/types';

const initialState = {
	// Checking to see if there is a token in local storage already
	token: localStorage.getItem('token'),
	//Value we check to see if we can display secure data
	isAuthenticated: null,
	// Will set to false once loaded
	loading: true,
	user: null,
};

// Load object as parameter so we don't have to load each individually
export default function (state = initialState, action) {
	// Retrieving what type of action it is from when it was called in actions as well as the content that is relevent to it
	const { type, payload } = action;

	switch (type) {
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: payload,
			};
		// Do the same things
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			localStorage.setItem('token', payload.token);
			return {
				// Whatever was in the state, return that
				...state,
				...payload,
				isAuthenticated: true,
				loading: false,
			};
		// Do the same things
		case REGISTER_FAIL:
		case LOGOUT:
		case LOGIN_FAIL:
		case AUTH_ERROR:
			//If the request for authorization failed, remove the token that is in local storage because it is unnecessary
			localStorage.removeItem('token');
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false,
				user: null,
			};
		default:
			return state;
	}
}
