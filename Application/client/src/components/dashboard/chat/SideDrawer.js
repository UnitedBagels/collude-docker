import { Box, Tooltip, Button, Drawer, Input } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';

const SideDrawer = ({ setSelectedChat }) => {
	const [search, setSearch] = useState('');
	const [searchResult, setsearchResult] = useState([]);
	const [loading, setloading] = useState(false);
	const [loadingChat, setLoadingChat] = useState();
	const [drawerOpen, setDrawerOpen] = useState(false);

	const handleSearch = async () => {
		if (search) {
			try {
				setloading(true);

				const { data } = await axios.get(`/api/users?search=${search}`);
				setloading(false);
				setsearchResult(data);
			} catch (error) {
				console.log('Error Occurred!');
			}
		}
	};

	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);

			const { data } = await axios.post('/api/chat', { userId });

			setSelectedChat(data);
			setLoadingChat(false);
			// onClose();
		} catch (error) {
			console.log('Unable to Access Chat');
		}
	};

	return (
		<>
			<Box>
				<Tooltip title='Search User'>
					<Button
						variant='contained'
						onClick={() => setDrawerOpen(!drawerOpen)}
					>
						Search User
					</Button>
				</Tooltip>
			</Box>

			<Drawer
				anchor='left'
				onClick={() => setDrawerOpen(false)}
				open={drawerOpen}
			>
				<Box padding={5}>
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
								handleFunction={() =>
									accessChat(resultUser._id)
								}
							/>
						))
					)}
				</Box>
			</Drawer>
		</>
	);
};

export default SideDrawer;
