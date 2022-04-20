const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { check, validationResult } = require('express-validator');

// Want to use middleware
const auth = require('../../middleware/auth');

// Using 'Meeting' model
const Availability = require('../../models/Availability');

// @route       GET api/availability
// @desc        Get self availabilities
// @access      Private
router.get('/', auth, async (req, res) => {
	try {
		const availSet = await Availability.findOne({ user: req.user.id });
		res.json(availSet.availabilities);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route       GET api/availability
// @desc        Get all availabities for a given user
// @access      Private
router.get('/:userId', auth, async (req, res) => {
	try {
		// Find user information - password from User collection
		const user = await Availability.findOne({ user: req.params.userId });
		if (!user) {
			return res.status(404).json({ msg: 'User not found' });
		}

		return res.json(user.availabilities);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route       POST api/availability
// @desc        Add a singular slot of availability
// @access      Private
// Use second parameter 'auth' to use the middleware -- the addition makes it PROTECTED
router.post('/', auth, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { startDate, endDate, repeat } = req.body;

	try {
		let userAvails = await Availability.findOne({ user: req.user.id });
		// If there is already an availability for this user, update it
		if (userAvails !== null) {
			const newAvail = {
				startDate: startDate,
				endDate: endDate,
				repeat: repeat,
			};

			console.log(userAvails);
			userAvails.availabilities.unshift(newAvail);
			await userAvails.save();
			// return res.json(newAvail);
			return res.json(userAvails.availabilities);
		}

		const availFields = {};

		const newRange = [
			{
				startDate: startDate,
				endDate: endDate,
				repeat: repeat,
			},
		];

		availFields.user = req.user.id;
		availFields.availabilities = newRange;
		userAvails = new Availability(availFields);
		await userAvails.save();
		return res.json(userAvails);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route       DELETE api/availability/:id
// @desc        Delete a slot of availability
// @access      Private
router.delete('/:id', auth, async (req, res) => {
	try {
		let userAvails = await Availability.findOne({ user: req.user.id });

		// If there is already an availability for this user, update it
		if (userAvails) {
			userAvails.availabilities = userAvails.availabilities.filter(
				(avail) => avail.id !== req.params.id
			);
			await userAvails.save();

			return res.json(userAvails.availabilities);
		}
		return res
			.status(404)
			.json({ msg: 'User has no listed availabilities' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
