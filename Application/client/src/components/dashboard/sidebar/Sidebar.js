import React from 'react';
import Conversations from './Conversations';
import Search from './Search';

const Sidebar = () => {
	return (
		<div className='sidebar'>
			<Search />
			<Conversations />
			<Conversations />
			<Conversations />
			<Conversations />
			<Conversations />
			<Conversations />
		</div>
	);
};

export default Sidebar;
