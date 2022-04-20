import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MeetingChat from './MeetingChat';

const ScrollableChat = ({ auth: { user }, messages, update, setUpdate }) => {
	const isSameSenderMargin = (messages, m, i, userId) => {
		if (
			i < messages.length - 1 &&
			messages[i + 1].sender._id === m.sender._id &&
			messages[i].sender._id !== userId
		)
			return 33;
		else if (
			(i < messages.length - 1 &&
				messages[i + 1].sender._id !== m.sender._id &&
				messages[i].sender._id !== userId) ||
			(i === messages.length - 1 && messages[i].sender._id !== userId)
		)
			return 0;
		else return 'auto';
	};

	const isSameUser = (messages, m, i) => {
		return i > 0 && messages[i - 1].sender._id === m.sender._id;
	};

	return (
		<ScrollableFeed>
			{messages &&
				messages.map((m, i) => (
					<>
						{m.meetingTitle ? (
							<MeetingChat
								message={m}
								update={update}
								setUpdate={setUpdate}
								user={user._id}
							/>
						) : (
							<div style={{ display: 'flex' }} key={m._id}>
								<span
									style={{
										backgroundColor: `${
											m.sender._id === user._id
												? '#BEE3F8'
												: '#B9F5D0'
										}`,
										borderRadius: '20px',
										fontSize: '24px',
										padding: '5px 15px',
										maxWidth: '75%',
										marginLeft: isSameSenderMargin(
											messages,
											m,
											i,
											user._id
										),
										marginTop: isSameUser(messages, m, i)
											? 3
											: 10,
									}}
								>
									{m.content}
								</span>
							</div>
						)}
					</>
				))}
		</ScrollableFeed>
	);
};

ScrollableChat.prototype = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(ScrollableChat);
