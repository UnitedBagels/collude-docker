import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button, Modal, Box } from '@mui/material';
import styles from '../styles/AvailSelector.module.css';
import moment from 'moment';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

import {
	addAvailability,
	removeAvailability,
} from '../../../actions/availability';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

const AvailSelector = ({ selectedDate, availabilities, repeats }) => {
	const dispatch = useDispatch();

	const [timeList, setTimeList] = useState([]);
	const [open, setOpen] = useState(false);

	const [startTime, setStartTime] = useState('00:00');
	const [endTime, setEndTime] = useState('23:59');

	const [combined, setCombined] = useState([]);
	const [updated, setUpdated] = useState(false);

	useEffect(() => {
		setTimeList([]);
		var weekDay = selectedDate.getDay();

		// Combine the availabilities array with the repeats[weekDay] array removing duplicates
		var allAvails = availabilities;
		allAvails.push.apply(allAvails, repeats[weekDay]);

		// Remove duplicates using a set
		var reducedAvails = [...new Set(allAvails)];

		setCombined(reducedAvails);

		// Sort reducedAvails by .startDate
		reducedAvails.sort((a, b) => {
			return new Date(a.startDate) - new Date(b.startDate);
		});

		const selectedYear = selectedDate.getFullYear();
		const selectedMonth = selectedDate.getMonth();
		const selectedDay = selectedDate.getDate();

		const rangeTuples = [];
		for (let i = 0; i < reducedAvails.length; i++) {
			const curStartDate = new Date(reducedAvails[i].startDate);
			const curEndDate = new Date(reducedAvails[i].endDate);

			var sameDayValid =
				curStartDate.getFullYear() === selectedYear &&
				curStartDate.getMonth() === selectedMonth &&
				curStartDate.getDate() === selectedDay &&
				reducedAvails[i].repeat === true;

			var validRepeat =
				curStartDate < selectedDate && reducedAvails[i].repeat === true;

			// console.log(curStartDate < selectedDate);

			if (
				reducedAvails[i].repeat === false ||
				validRepeat ||
				sameDayValid
			) {
				// Append rangeTuples with a list of tuples with the first value as a time range and the second value as the ._id
				rangeTuples.push([
					moment(curStartDate).format('hh:mm A'),
					moment(curEndDate).format('hh:mm A'),
					reducedAvails[i]._id,
				]);
			}
			setTimeList(rangeTuples);
		}
	}, [selectedDate, availabilities, repeats]);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const updateStartTime = ({ target }) => {
		setStartTime(target.value);
	};

	const updateEndTime = ({ target }) => {
		setEndTime(target.value);
	};

	const [checked, setChecked] = React.useState(false);

	const onCheck = (e) => {
		setChecked(!checked);
	};

	const onSubmit = (e) => {
		const formData = {
			startDate: new Date(
				`${selectedDate.getFullYear()}-${
					selectedDate.getMonth() + 1
				}-${selectedDate.getDate()} ${startTime}`
			),
			endDate: new Date(
				`${selectedDate.getFullYear()}-${
					selectedDate.getMonth() + 1
				}-${selectedDate.getDate()} ${endTime}`
			),
			repeat: checked,
		};

		if (formData.startDate > formData.endDate) {
			alert('Start time must be before end time');
			return;
		}

		e.preventDefault();

		dispatch(addAvailability(formData));
		setUpdated(true);
	};

	return (
		<div className='availBox'>
			<div className='availHeader'>
				<h2 className='white'>
					{selectedDate.getMonth() + 1}/{selectedDate.getDate()}/
					{selectedDate.getFullYear()}
				</h2>
			</div>
			<div className='timeRanges'>
				{timeList.map((time) => {
					return (
						<div key={time[2]}>
							<span className='timeRange'>
								{time[0]} - {time[1]} {''}
							</span>
							<span
								onClick={() => {
									dispatch(removeAvailability(time[2]));
								}}
								className='fas fa-minus-circle timeRange'
							></span>
						</div>
					);
				})}
			</div>
			<Box textAlign='center' className='availSubmitForm'>
				<form
					onSubmit={(e) => onSubmit(e)}
					className={styles.timeContainer}
					noValidate
				>
					<div className='dateRangeContainer'>
						<TextField
							id='time'
							label='Start Time'
							type='time'
							value={startTime}
							// onChange={onChange}
							onChange={updateStartTime}
							className='fromTimeBox'
							InputLabelProps={{
								shrink: true,
							}}
							inputProps={{
								step: 300, // 5 min
							}}
						/>

						<TextField
							id='time'
							label='End Time'
							type='time'
							value={endTime}
							// onChange={onChange}
							onChange={updateEndTime}
							className='toTimeBox'
							InputLabelProps={{
								shrink: true,
							}}
							inputProps={{
								step: 300, // 5 min
							}}
						/>
					</div>
					<div className='repeatContainer'>
						<label class='container'>
							Repeat
							<input
								type='checkbox'
								id='repeat'
								name='repeat'
								className='repeatCheckbox'
								value={checked}
								onChange={onCheck}
							></input>
							<span class='checkmark'></span>
						</label>

						<input
							variant='contained'
							color='primary'
							className='timeSubmit'
							type='submit'
						/>
					</div>
				</form>
			</Box>
		</div>
	);
};
export default AvailSelector;

// // Use mapStateToProps when we want to pull a value from the state, in this case updating auth
// const mapStateToProps = (state) => ({
// 	// availability: state.availability,
// });

// export default connect(mapStateToProps, { addAvailability })(AvailSelector);
