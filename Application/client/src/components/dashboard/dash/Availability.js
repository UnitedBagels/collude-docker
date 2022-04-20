import React, { Fragment, useEffect } from 'react';
import DateSelector from './DateSelector';
import AvailSelector from './AvailSelector';
import axios from 'axios';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getSelfAvailability } from '../../../actions/availability';
import { useDispatch, useSelector } from 'react-redux';

const Availability = ({ availability: { availabilities } }) => {
	const dispatch = useDispatch();

	const [date, setDate] = React.useState(new Date());
	const [valid, setValid] = React.useState();

	const [avails, setAvails] = React.useState([]);
	const [repeats, setRepeats] = React.useState([[], [], [], [], [], [], []]);

	useEffect(() => {
		dispatch(getSelfAvailability());
	}, [dispatch]);

	useEffect(() => {
		var repeatList = [[], [], [], [], [], [], []];
		for (let i = 0; i < availabilities.length; i++) {
			if (availabilities[i].repeat === true) {
				const dateObj = new Date(availabilities[i].startDate);
				repeatList[dateObj.getDay()].push(availabilities[i]);
			}
		}
		setRepeats(repeatList);
	}, [availabilities]);

	useEffect(() => {
		const newAvail = availabilities.filter((avail) => {
			const filStartDate = new Date(avail.startDate);
			return filStartDate.toDateString() === date.toDateString();
		});
		setAvails(newAvail);
	}, [date, availabilities]);

	return (
		<div className='availability'>
			<div>
				<h2>Availability</h2>
				<h3>Keep Your Schedule Up to Date</h3>
			</div>
			<div className='containerBox'>
				<DateSelector
					selectionType='other'
					setDate={setDate}
					setValid={setValid}
					avails={availabilities}
				/>
			</div>
			<Fragment>
				{valid && (
					<div className='addAvailBox'>
						<AvailSelector
							selectedDate={date}
							availabilities={avails}
							repeats={repeats}
						/>
					</div>
				)}
			</Fragment>
		</div>
	);
};

Availability.propType = {
	availability: PropTypes.object.isRequired,
};

// Use mapStateToProps when we want to pull a value from the state, in this case updating auth
const mapStateToProps = (state) => ({
	availability: state.availability,
});

export default connect(mapStateToProps, { getSelfAvailability })(Availability);
