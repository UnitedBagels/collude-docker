import axios from 'axios';

import {
	GET_AVAILABILITY,
	GET_OTHER_AVAILABILITY,
	ADD_AVAILABILITY,
	ADD_AVAILABILITY_ERROR,
	REMOVE_AVAILABILITY,
	REMOVE_AVAILABILITY_ERROR,
} from './types';

// Get current users profile
export const getSelfAvailability = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/availability');

		dispatch({
			type: GET_AVAILABILITY,
			payload: res.data,
		});
	} catch (err) {
		console.log(err);
	}
};

// Get someone else's availability
export const getOtherAvailability = (userId) => async (dispatch) => {
	try {
		const res = await axios.get('/api/availability/' + userId);

		dispatch({
			type: GET_OTHER_AVAILABILITY,
			payload: res.data,
		});
	} catch (err) {
		console.log(err);
	}
};

// Add Availability
export const addAvailability = (formData) => async (dispatch) => {
	// Sending data so we need to create a config object with headers and data
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	try {
		// Prepare response that will be returned when a request is made to api address with given body and config objects
		const res = await axios.post('/api/availability', formData, config);
		// If everything goes okay with the response, we want to dispatch register_success
		dispatch({
			type: ADD_AVAILABILITY,
			payload: res.data,
		});
	} catch (err) {
		// Variable to store the alerts sent back by the api
		const errors = err.response.data.errors;

		if (errors) {
			console.log(errors);
		}
		// If something goes wrong dispatch register fail
		dispatch({
			type: ADD_AVAILABILITY_ERROR,
			// Don't need to attach payload since the reducer for register_fail doesn't utilize one
		});
	}
};

// Remove Availability
export const removeAvailability = (id) => async (dispatch) => {
	try {
		const res = await axios.delete(`/api/availability/${id}`);

		dispatch({
			type: REMOVE_AVAILABILITY,
			payload: res.data,
		});
	} catch (err) {
		// Variable to store the alerts sent back by the api
		const errors = err.response.data.errors;

		if (errors) {
			console.log(errors);
		}
		// If something goes wrong dispatch register fail
		dispatch({
			type: REMOVE_AVAILABILITY_ERROR,
			// Don't need to attach payload since the reducer for register_fail doesn't utilize one
		});
	}
};
