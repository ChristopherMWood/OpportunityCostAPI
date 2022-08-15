import axios from 'axios'
import logger from '../../logger.js'

class YoutubeApiProxy {
	static getVideoMetadataAsync(videoId: string, apiKey: string, success: Function, failure: Function) {
		const requestUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoId}&key=${apiKey}`

		axios.get(requestUrl)
			.then(function (response) {
				if (response.data.items && response.data.items.length > 0) {
					success(response.data.items[0]);
				} else {
					const errorMessage = 'Response object was not formatted as expected.';
					logger.error(errorMessage)
					failure(errorMessage);
				}
			})
			.catch(function (error) {
				logger.error(error)
				failure(error)
			})
	}
}

export { YoutubeApiProxy }