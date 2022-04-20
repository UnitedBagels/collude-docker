import React from 'react';
import moment from 'moment';
import axios from 'axios';

const MeetingChat = ({ message, update, setUpdate, user }) => {
	const [status, setStatus] = React.useState(false);

	const meetingAccept = async (event) => {
		try {
			const { data } = await axios.post('/api/message/' + message._id, {
				// messageId: message.chat.groupAdmin,
				accepted: true,
			});
			setUpdate(!update);
		} catch (error) {
			console.log(error);
		}
	};

	const meetingDecline = async (event) => {
		try {
			const { data } = await axios.post('/api/message/' + message._id, {
				// messageId: message.chat.groupAdmin,
				accepted: false,
			});
			setUpdate(!update);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='meetingRequest'>
			<div className='meetingContent'>
				<h3>
					Meeting Requested -{' '}
					{moment(message.startDate).format('MMMM Do - h:mm A')}
				</h3>
				<h4>
					{message.sender.name}: {message.meetingTitle}
				</h4>
			</div>
			{message.accepted === undefined ? (
				<div className='meetingControls'>
					<button
						className='buttonContainer'
						onClick={() => {
							meetingAccept();
							setStatus(!status);
						}}
					>
						<i className='fa-solid fa-calendar-check acceptButton'></i>
					</button>
					<button
						className='buttonContainer'
						onClick={() => {
							meetingDecline();
							setStatus(!status);
						}}
					>
						<i className='fa-solid fa-calendar-xmark declineButton'></i>
					</button>
				</div>
			) : message.accepted === true ? (
				<div className='meetingControls'>
					<button className='buttonContainer selectedGood'>
						<i className='fa-solid fa-calendar-day'></i>
					</button>
				</div>
			) : (
				<div className='meetingControls'>
					<button className='buttonContainer selectedBad'>
						<i className='fa-solid fa-calendar-xmark'></i>
					</button>
				</div>
			)}
		</div>
	);
};

export default MeetingChat;
