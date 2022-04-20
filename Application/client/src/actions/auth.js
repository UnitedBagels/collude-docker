// How we make requests
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	CLEAR_AVAILABILITY,
	CLEAR_CHATS,
	CLEAR_MEETINGS,
} from './types';

// Load User
export const loadUser = () => async (dispatch) => {
	if (localStorage.token) {
		// If the register or login function load a token successfully, call setAuthToken to store that in the header
		setAuthToken(localStorage.token);
	}

	try {
		const res = await axios.get('/api/auth');

		dispatch({
			type: USER_LOADED,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: AUTH_ERROR,
		});
	}
};

// Register User
export const register =
	({ name, email, password }) =>
	async (dispatch) => {
		// Sending data so we need to create a config object with headers and data
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const body = JSON.stringify({ name, email, password });

		try {
			// Prepare response that will be returned when a request is made to api address with given body and config objects
			const res = await axios.post('/api/users', body, config);
			// If everything goes okay with the response, we want to dispatch register_success
			dispatch({
				type: REGISTER_SUCCESS,
				payload: res.data,
			});

			// Load the user data into store and local memory(token)
			dispatch(loadUser());
		} catch (err) {
			// Variable to store the alerts sent back by the api
			const errors = err.response.data.errors;

			// TODO: Replace this with an alert later
			console.log(errors);

			// If something goes wrong dispatch register fail
			dispatch({
				type: REGISTER_FAIL,
				// Don't need to attach payload since the reducer for register_fail doesn't utilize one
			});
		}
	};

// Login User
export const login = (email, password) => async (dispatch) => {
	// Sending data so we need to create a config object with headers and data
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const body = JSON.stringify({ email, password });
	try {
		// Prepare response that will be returned when a request is made to api address with given body and config objects
		const res = await axios.post('/api/auth', body, config);
		// If everything goes okay with the response, we want to dispatch register_success
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data,
		});

		// Load the user data into store and local memory(token)
		dispatch(loadUser());
	} catch (err) {
		// Variable to store the alerts sent back by the api
		const errors = err.response.data.errors;

		// TODO: Replace this with an alert later
		console.log(errors);

		// If something goes wrong dispatch register fail
		dispatch({
			type: LOGIN_FAIL,
			// Don't need to attach payload since the reducer for register_fail doesn't utilize one
		});
	}
};

// Logout
export const logout = () => (dispatch) => {
	dispatch({
		type: CLEAR_AVAILABILITY,
	});
	dispatch({
		type: LOGOUT,
	});
	dispatch({
		type: CLEAR_CHATS,
	});
	dispatch({
		type: CLEAR_MEETINGS,
	});
};
