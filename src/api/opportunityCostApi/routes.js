import express from 'express'
import { YoutubeApiProxy } from './youtubeApiProxy.js'
import { ParsingHelpers } from './parsingHelpers.js'
import ChannelRepository from '../services/channelRepository.js'
import VideoRepository from '../services/videoRepository.js' 
import logger from '../../logger.js'

const router = express.Router()

router.get('/top-videos', (req, res) => {
	const pageParam = req.query.page;
	const page = pageParam ? pageParam : 0;

	const pageSizeParam = req.query.pageSize;
	const pageSize = pageSizeParam ? pageSizeParam : 20;

	VideoRepository.getTopVideosByOpportunityCost(page, pageSize, (results) => {
		res.status(200)
		res.send(JSON.stringify(results))
	});
})

router.get('/:youtubeVideoId', (req, res) => {
	res.type('application/json')

	const videoId = req.params.youtubeVideoId

	YoutubeApiProxy.getMetadata(videoId, process.env.GOOGLE_API_KEY, (videoData) => {
		const videoSeconds = ParsingHelpers.getSecondsFromVideoDuration(videoData.contentDetails.duration)
		const totalOpportunityCost = videoData.statistics.viewCount * videoSeconds

		const responseData = {
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

		ChannelRepository.upsertChannel(responseData).then(() => {
			VideoRepository.upsertVideo(responseData).then(() => {
				res.status(200)
				res.send(JSON.stringify(responseData))
			});
		});
	}, (error) => {
		res.status(400)
		res.send(JSON.stringify({
			message: 'An unknown error occured loading the data'
		}))
	})
})

export default router