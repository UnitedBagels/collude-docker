import React from 'react';
import moment from 'moment';

const SingleMeeting = ({ meeting, self, chatList }) => {
	// console.log(chatList);
	const chat = chatList.find((chat) => chat._id === meeting.chat);
	// concatonate chat.users into a single string
	const users = chat.users.map((user) => user.name).join(', ');
	const now = moment(new Date());
	const start = moment(meeting.startDate);

	let hours = start.diff(now, 'hours');

	return (
		<div className='singleMeeting'>
			{/* {console.log(meeting.accepted)} */}
			<h2 className='meetingTitle'>{meeting.meetingTitle}</h2>
			<p>{users}</p>
			<p>{moment(meeting.startDate).format('MMMM Do: h:mm A')}</p>
			<div className='meetingFooter'>
				<p className='fas fa-cog'></p>
				{meeting.sender === self ? <p> Owner </p> : <p> Member </p>}
				{hours < 48 ? (
					<button className='startBttn'>Start</button>
				) : (
					<button className='startBttnDis' disabled>
						Start
					</button>
				)}
			</div>
		</div>
	);
};

export default SingleMeeting;
