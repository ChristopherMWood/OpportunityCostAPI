import axios from 'axios'
import logger from '../../logger.js'

class YoutubeApiProxy {
	static async getVideoMetadataAsync(videoId: string, apiKey: string): Promise<any> {
		const requestUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoId}&key=${apiKey}`

		try {
			const response = await axios.get(requestUrl)

			if (response.data.items && response.data.items.length > 0) {
				return response.data.items[0];
			}

			throw new Error('Response object was not formatted as expected.');
		} catch (error: any) {
			logger.error(error)
			throw error;
		}
	}
}

export { YoutubeApiProxy }