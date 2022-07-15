import axios from 'axios'
import logger from '../../logger.js'

class YoutubeApiProxy {
	static getMetadata(videoId, apiKey, success, failure) {
		const requestUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&fields=items.contentDetails.duration,items.statistics.viewCount&id=${videoId}&key=${apiKey}`
		axios.get(requestUrl)
			.then(function (response) {
				let videoDuration = response.data.items[0].contentDetails.duration
				let views = response.data.items[0].statistics.viewCount

				success({
					videoDuration: videoDuration,
					views: views
				})
			})
			.catch(function (error) {
				logger.error(error)
				failure(error)
			})
	}
}

export { YoutubeApiProxy }