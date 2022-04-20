import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MyChats from '../dashboard/chat/MyChats';

import styles from './style/sideBar.module.css';
import { getChats } from '../../actions/chat';

import { useDispatch } from 'react-redux';

// Search imports, edit later
import { Button, Input } from '@mui/material';
import ChatLoading from '../dashboard/chat/ChatLoading';
import UserListItem from '../dashboard/chat/UserListItem';
import axios from 'axios';
import { accessChat } from '../../actions/chat';
import { getOtherAvailability } from '../../actions/availability';

const SideBar = ({
	auth: { isAuthenticated, user },
	chat: { chats, chat },
}) => {
	const dispatch = useDispatch();

	// Search functionality here
	const [selectedChat, setSelectedChat] = useState({});
	const [search, setSearch] = useState('');
	const [searchResult, setsearchResult] = useState([]);
	const [loading, setloading] = useState(false);

	useEffect(() => {
		dispatch(getChats());
	}, [user, dispatch]);

	const slideIn = () => {
		var x = document.getElementById('slider');
		if (x.className === styles.slideOut) {
			var y = document.getElementsByClassName('page');
			[...y].forEach((x) => (x.className = 'pageExpand'));
			x.className = styles.slideIn;
		} else {
			x.className = styles.slideOut;
			var z = document.getElementsByClassName('pageExpand');
			[...z].forEach((x) => (x.className = 'page'));
		}
	};

	const handleSearch = async () => {
		if (search) {
			// dispatch(accessChat(search));
			try {
				setloading(true);
				const res = await axios.get(`/api/users?search=${search}`);
				setloading(false);
				setsearchResult(res.data);
			} catch (error) {
				console.log('Error Occurred!');
			}
		}
	};

	// const accessChat = async (userId) => {
	// 	try {
	// 		const { data } = await axios.post('/api/chat', { userId });
	// 		setSelectedChat(data);
	// 	} catch (error) {
	// 		console.log('Unable to Access Chat');
	// 	}
	// };

	return (
		<Fragment>
			{isAuthenticated && (
				<div id='slider' className={styles.slideOut}>
					<div className='userSearch'>
						<Input
							placeholder='Search a user by name or email'
							margin-right={2}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<Button onClick={handleSearch}>Go</Button>
						{loading ? (
							<ChatLoading />
						) : (
							searchResult.map((resultUser) => (
								<UserListItem
									key={resultUser._id}
									user={resultUser}
									handleFunction={() => {
										dispatch(accessChat(resultUser._id));
										setSelectedChat(resultUser);
										setsearchResult([]);
										setSearch('');
									}}
								/>
							))
						)}
					</div>

					<div>
						<MyChats
							selectedChat={chat}
							loggedUser={user}
							chats={chats}
						/>
						{/* <MyChats loggedUser={auth.user} /> */}
					</div>
					<div
						id='slideOutTab'
						className={styles.slideOutTab}
						onClick={slideIn}
					>
						<div className={styles.slideButton} onClick={slideIn}>
							<p onClick={slideIn}> Profile </p>
						</div>
					</div>
				</div>
			)}
		</Fragment>
	);
};

// List all proptypes here for error checking
// This should contain all props used and be reflected by the function parameters that use them above
// SideBar.propTypes = {
// 	getCurrentProfile: PropTypes.func.isRequired,
// 	auth: PropTypes.object.isRequired,
// };

// Use mapStateToProps when we want to pull a value from the state, in this case updating auth and the profile object
const mapStateToProps = (state) => ({
	auth: state.auth,
	chat: state.chat,
});

// Need to export connect with the component itself
// export default connect()(SideBar);

// First parameter is any state that you want to map, second is an object with any actions you want to use with this component
// export default SideBar;

export default connect(mapStateToProps, {})(SideBar);
