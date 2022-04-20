import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import PickersDay from '@mui/lab/PickersDay';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const CustomPickersDay = styled(PickersDay, {
	shouldForwardProp: (prop) => prop !== 'isDateInList',
})(({ theme, isDateInList }) => ({
	...(isDateInList && {
		borderRadius: '25%',
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.common.white,
		'&:hover, &:focus': {
			backgroundColor: theme.palette.primary.dark,
		},
	}),
}));

function parseJSONDates(dateList) {
	// Loop through dateList and return all dates
	let dates = [];
	let repeats = [null, null, null, null, null, null, null];

	for (let i = 0; i < dateList.length; i++) {
		const dateObj = new Date(dateList[i].startDate);
		dates.push(dateObj.toDateString());
		if (dateList[i].repeat === true) {
			repeats[dateObj.getDay()] = dateObj;
		}
	}

	return [dates, repeats];
}

export default function DateSelector({
	selectionType,
	setDate,
	setValid,
	avails,
}) {
	const [value, setValue] = React.useState(new Date());
	const [dates, repeats] = parseJSONDates(avails);

	const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
		let available = false;
		let disabled = false;

		// Check if the date is in the list of dates
		const isDateInList = dates.includes(date.toDateString());
		if (repeats[date.getDay()] !== null) {
			if (date > repeats[date.getDay()]) {
				available = true;
			}
		}

		if (selectionType === 'other' && !(isDateInList || available)) {
			disabled = true;
		}

		return (
			<CustomPickersDay
				{...pickersDayProps}
				disabled={false}
				selected={false}
				// disableMargin
				isDateInList={isDateInList || available}
			/>
		);
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<StaticDatePicker
				displayStaticWrapperAs='desktop'
				label='Week picker'
				value={value}
				onChange={(newValue) => {
					setValue(newValue);
					setDate(newValue);
					setValid(1); // TODO: make this equal to zero if you scroll to another page
				}}
				renderDay={renderWeekPickerDay}
				renderInput={(params) => <TextField {...params} />}
				inputFormat="'Week of' MMM d"
			/>
		</LocalizationProvider>
	);
}
