import axios from 'axios';

import { GET_MEETINGS } from './types';

// Get current users meetings
export const getMeetings = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/message');

		dispatch({
			type: GET_MEETINGS,
			payload: res.data,
		});
	} catch (err) {
		console.log(err);
	}
};
