const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailabilitySchema = new mongoose.Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user',
	},
	availabilities: [
		{
			startDate: {
				type: Date,
				required: true,
			},
			endDate: {
				type: Date,
				required: true,
			},
			repeat: {
				type: Boolean,
				required: true,
			},
		},
	],
});

module.exports = User = mongoose.model('availability', AvailabilitySchema);
