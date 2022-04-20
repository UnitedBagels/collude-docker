import React from 'react';
import MeetingSelector from './MeetingSelector';

function Meetings() {
	const [time, setTime] = React.useState(new Date());
	console.log(time.startTime);
	return <div>{<MeetingSelector setTime={setTime} />}</div>;
}

export default Meetings;
