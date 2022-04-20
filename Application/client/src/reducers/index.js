import { combineReducers } from 'redux';
import auth from './auth';
import availability from './availability';
import chat from './chat';
import meeting from './meeting';

export default combineReducers({
	//Add all reducers we make in here
	auth,
	availability,
	chat,
	meeting,
});
