import { parse } from 'tinyduration'
import TimeConstants from '../constants/timeConstants';

const getSecondsFromISO8601 = (ISO8601Duration: string) => {
	let totalSeconds = 0
	let time = null;
	
	try {
		time = parse(ISO8601Duration)
	} catch (error) {
		throw error
	}

	if (time.days) totalSeconds += time.days * TimeConstants.SECONDS_IN_DAY
	if (time.hours) totalSeconds += time.hours * TimeConstants.SECONDS_IN_HOUR
	if (time.minutes) totalSeconds += time.minutes * TimeConstants.SECONDS_IN_MINUTE
	if (time.seconds) totalSeconds += time.seconds

	return totalSeconds
}	

export { getSecondsFromISO8601 }