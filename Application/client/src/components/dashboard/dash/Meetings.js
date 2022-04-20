import React, { useEffect } from 'react';
import SingleMeeting from './SingleMeeting';
import { connect } from 'react-redux';
import { getMeetings } from '../../../actions/meetings';
import { useDispatch } from 'react-redux';

const Meetings = ({
	meeting: { meetings },
	auth: { user },
	chat: { chats },
}) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getMeetings());
	}, []);

	return (
		<div className='meetings'>
			<div>
				<h2>Meetings</h2>
				<h3>Your daily Meeting Summary</h3>
			</div>
			{meetings.length &&
				meetings.map((meeting) => (
					<SingleMeeting
						meeting={meeting}
						key={meeting._id}
						self={user._id}
						chatList={chats}
					/>
				))}
		</div>
	);
};

const mapStateToProps = (state) => ({
	meeting: state.meeting,
	auth: state.auth,
	chat: state.chat,
});

// export default Meetings;
export default connect(mapStateToProps, {})(Meetings);
