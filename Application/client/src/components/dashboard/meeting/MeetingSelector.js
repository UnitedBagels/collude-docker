import React from 'react';
import { ScheduleMeeting } from 'react-schedule-meeting';

Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

const dateList = {
	availabilities: [
		{
			startDate: new Date('2022-4-15 12:00 AM'),
			endDate: new Date('2022-4-15 11:00 PM'),
			repeat: true,
		},
	],
};

// const availableTimeslots = [0, 1, 2, 3, 4, 5].map((id) => {
//     return {
//       id,
//       startTime: new Date(
//         new Date(new Date().setDate(new Date().getDate() + id)).setHours(9,0,0,0)
//       ),
//       endTime: new Date(
//         new Date(new Date().setDate(new Date().getDate() + id)).setHours(21,0,0,0)
//       )
//     };
//   });

function dateListToTimeSlots(dateList) {
	let id = 0;
	let timeSlots = [];
	// console.log(dateList.personAvails);
	const today = new Date();
	for (let i = 0; i < dateList.length; i++) {
		let slot = {};
		slot.id = id;
		id++;
		slot.startTime = new Date(dateList[i].startDate);
		slot.endTime = new Date(dateList[i].endDate);

		if (slot.startTime >= today) {
			timeSlots.push(slot);
		}

		if (dateList[i].repeat) {
			for (let j = 1; j < 5; j++) {
				let slot = {};
				slot.id = id;
				id++;
				slot.startTime = new Date(dateList[i].startDate).addDays(j * 7);
				slot.endTime = new Date(dateList[i].endDate).addDays(j * 7);

				if (slot.startTime >= today) {
					timeSlots.push(slot);
				}
			}
		}
	}
	return timeSlots;
}

function MeetingSelector({
	setTime,
	setMeetingTitle,
	handleClose,
	submitRequest,
	personAvails,
}) {
	const availableTimeslots = dateListToTimeSlots(
		{ personAvails }.personAvails
	);

	return (
		<div>
			<ScheduleMeeting
				borderRadius={10}
				primaryColor='#3f5b85'
				eventDurationInMinutes={60}
				availableTimeslots={availableTimeslots}
				onStartTimeSelect={(time) => {
					console.log(time.startTime);
					setTime(time.startTime);
					submitRequest();
					setMeetingTitle('');
					setTime(null);
					handleClose();
				}}
				className='blah'
			/>
		</div>
	);
}

export default MeetingSelector;
