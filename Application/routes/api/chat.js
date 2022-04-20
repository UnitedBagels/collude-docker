const express = require('express');

// Want to use middleware
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const Chat = require('../../models/Chat');

const router = express.Router();

// @route       Post api/chat
// @desc        Create or Fetch one-to-one chat
// @access      Public
router.post('/', auth, async (req, res) => {
	const { userId } = req.body;

	if (!userId) {
		console.log('UserId param not sent with the request');
		return res.sendStatus(400);
	}

	var isChat = await Chat.find({
		isGroupChat: false,
		$and: [
			{ users: { $elemMatch: { $eq: req.user.id } } },
			{ users: { $elemMatch: { $eq: userId } } },
		],
	})
		.populate('users', '-password')
		.populate('latestMessage');

	// console.log(isChat);

	isChat = await User.populate(isChat, {
		path: 'latestMessage.sender',
		select: 'name email',
	});

	if (isChat.length > 0) {
		res.send(isChat[0]);
	} else {
		var chatData = {
			chatName: 'sender',
			isGroupChat: false,
			groupAdmin: userId,
			users: [req.user.id, userId],
		};

		try {
			const createdChat = await Chat.create(chatData);

			const FullChat = await Chat.findOne({
				_id: createdChat._id,
			}).populate('users', '-password');

			res.status(200).send(FullChat);
		} catch (err) {
			res.status(400);
			throw new Error(err.message);
		}
	}
});

// @route       Get api/chat
// @desc        Fetch all chats for the user
// @access      Public
router.get('/', auth, (req, res) => {
	try {
		Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
			.populate('users', '-password')
			.populate('groupAdmin', '-password')
			.populate('latestMessage')
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				results = await User.populate(results, {
					path: 'latestMessage.sender',
					select: 'name email',
				});

				res.status(200).send(results);
			});
	} catch (err) {
		res.status(400);
		throw new Error(err.message);
	}
});

// @route       Post api/chat/group
// @desc        Create or Fetch a Group Chat
// @access      Public
router.post('/group', auth, async (req, res) => {
	if (!req.body.users || !req.body.name) {
		return res.status(400).send({ message: 'Please Fill all the fields' });
	}

	var users = JSON.parse(req.body.users);

	if (users.length < 2) {
		return res
			.status(400)
			.send('More than 2 users are required to form a group chat');
	}

	users.push(req.user.id);
	console.log(users);

	try {
		const groupChat = await Chat.create({
			chatName: req.body.name,
			users: users,
			isGroupChat: true,
			groupAdmin: req.user.id,
		});

		const fullGroupChat = await Chat.findOne({ _id: groupChat.id })
			.populate('users', '-password')
			.populate('groupAdmin', '-password');

		res.status(200).json(fullGroupChat);
	} catch (err) {
		res.status(400);
		throw new Error(err.message);
	}
});

// @route       Post api/chat/rename
// @desc        Rename a group
// @access      Public
router.put('/rename', auth, async (req, res) => {
	const { chatId, chatName } = req.body;

	const updatedChat = await Chat.findByIdAndUpdate(
		chatId,
		{
			chatName,
		},
		{
			new: true,
		}
	)
		.populate('users', '-password')
		.populate('groupAdmin', '-password');

	if (!updatedChat) {
		res.status(400);
		throw new Error('Chat Not Found');
	} else {
		res.status(200);
		res.json(updatedChat);
	}
});

// @route       Post api/chat/groupadd
// @desc        Add a user to a group
// @access      Public
router.put('/groupadd', auth, async (req, res) => {
	const { chatId, userId } = req.body;

	const added = await Chat.findByIdAndUpdate(
		chatId,
		{
			$push: { users: userId },
		},
		{
			new: true,
		}
	)
		.populate('users', '-password')
		.populate('groupAdmin', '-password');

	if (!added) {
		res.status(404);
		throw new Error('Chat Not Found');
	} else {
		res.status(200);
		res.json(added);
	}
});

// @route       Post api/chat/groupremove
// @desc        Add a user to a group
// @access      Public
router.put('/groupremove', auth, async (req, res) => {
	const { chatId, userId } = req.body;

	const removed = await Chat.findByIdAndUpdate(
		chatId,
		{
			$pull: { users: userId },
		},
		{
			new: true,
		}
	)
		.populate('users', '-password')
		.populate('groupAdmin', '-password');

	if (!removed) {
		res.status(404);
		throw new Error('Chat Not Found');
	} else {
		res.status(200);
		res.json(removed);
	}
});

module.exports = router;
