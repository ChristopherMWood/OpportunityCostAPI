import express from 'express'
import { YoutubeApiProxy } from './youtubeApiProxy.js'
import { ParsingHelpers } from './parsingHelpers.js'
import logger from '../../logger.js'

const router = express.Router()

router.get('/:youtubeVideoId', (req, res) => {
	res.type('application/json')

	const videoId = req.params.youtubeVideoId

	YoutubeApiProxy.getMetadata(videoId, process.env.GOOGLE_API_KEY, (videoData) => {
		const videoSeconds = ParsingHelpers.getSecondsFromVideoDuration(videoData.contentDetails.duration)
		const totalOpportunityCost = videoData.statistics.viewCount * videoSeconds
		const formattedResponseObject = {
			videoMeta: {
				id: videoData.id,
				title: videoData.snippet.title,
				views: videoData.statistics.viewCount,
				likes: videoData.statistics.likeCount,
				length: videoSeconds,
				opportunityCost: totalOpportunityCost,
				publishDate: videoData.snippet.publishedAt,
				thumbnails: videoData.snippet.thumbnails
			},
			channelMeta: {
				id: videoData.snippet.channelId,
				name: videoData.snippet.channelTitle,
				creationDate: null,
				thumbnails: null,
			}
		}

		res.status(200)
		res.send(JSON.stringify(formattedResponseObject))
		//TODO: UPDATE DATA FOR VIDEO IN DB ASYNC HERE <-------------
		//TODO: UPDATE DATA FOR CHANNEL IN DB ASYNC HERE <-------------
	}, (error) => {
		res.status(400)
		res.send(JSON.stringify({
			message: 'An unknown error occured loading the data'
		}))
	})
})

router.get('/top', (req, res) => {
	res.status(200)
	res.send(JSON.stringify({
		message: 'Not implemented yet'
	}))
})

export default router