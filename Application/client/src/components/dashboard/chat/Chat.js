import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SingleChat from './SingleChat';

const Chat = ({ auth: { user }, chat: { chats, chat } }) => {
	return (
		<div className='page'>{user && <SingleChat selectedChat={chat} />}</div>
	);
};

Chat.prototype = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	chat: state.chat,
});

export default connect(mapStateToProps)(Chat);
