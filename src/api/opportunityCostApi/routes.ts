import express from 'express'
import { YoutubeApiProxy } from '../../domain/proxies/youtubeApiProxy'
import { getSecondsFromISO8601 } from '../../domain/parsers/timeFormatParsers'
import ChannelRepository from '../../domain/repositories/channelRepository'
import VideoRepository from '../../domain/repositories/videoRepository' 
import logger from '../../logger'
 
const router = express.Router()
const DEFAULT_PAGE = 0
const DEFAULT_PAGE_SIZE = 20

router.get('/top-channels', (req, res) => {
	const pageParam = req.query.page as string;
	const page = pageParam ? parseInt(pageParam) : DEFAULT_PAGE;

	const pageSizeParam = req.query.pageSize as string;
	const pageSize = pageSizeParam ? parseInt(pageSizeParam) : DEFAULT_PAGE_SIZE;

	ChannelRepository.getTopChannelsByOpportunityCost(page, pageSize, (results: any) => {
		res.status(200)
		res.send(JSON.stringify(results))
	});
})

router.get('/top-videos', (req, res) => {
	const pageParam = req.query.page as string;
	const page = pageParam ? parseInt(pageParam) : DEFAULT_PAGE;

	const pageSizeParam = req.query.pageSize as string;
	const pageSize = pageSizeParam ? parseInt(pageSizeParam) : DEFAULT_PAGE_SIZE;

	VideoRepository.getTopVideosByOpportunityCost(page, pageSize, (results: any) => {
		res.status(200)
		res.send(JSON.stringify(results))
	});
})

router.get('/channel/:channelId', async (req, res) => {
	const channelId = req.params.channelId

	try {
		const channel = await ChannelRepository.getChannelAsync(channelId);
		res.status(200)
		res.send(JSON.stringify(channel))
	} catch (error) {
		res.status(404)
		res.send()
	}
})

router.get('/video/:videoId', async (req, res) => {
	const videoId = req.params.videoId
	const video = await VideoRepository.getVideoAsync(videoId);

	if (video) {
		res.status(200)
		res.send(JSON.stringify(video))
	} else {
		res.status(404)
		res.send()
	}
})

router.get('/:youtubeVideoId', async (req, res) => {
	res.type('application/json')

	const videoId = req.params.youtubeVideoId

	//TODO: FIX NULL COALLECING OPERATION HERE
	YoutubeApiProxy.getVideoMetadataAsync(videoId, process.env.GOOGLE_API_KEY || '', async (videoData: any) => {
		const videoSeconds = getSecondsFromISO8601(videoData.contentDetails.duration)
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

		//TEST & VERIFY CHANNEL OPPORTUNITY COST CALCULATION
		const existingVideo = await VideoRepository.getVideoAsync(responseData.videoMeta.id);
		const oppCostDiff = existingVideo ? responseData.videoMeta.opportunityCost - existingVideo.opportunityCost : responseData.videoMeta.opportunityCost;

		await VideoRepository.upsertVideoAsync(responseData);
		await ChannelRepository.upsertChannel(responseData, oppCostDiff)

		res.status(200)
		res.send(JSON.stringify(responseData))
	}, (error: Error) => {
		res.status(400)
		res.send(JSON.stringify({
			message: 'An unknown error occured loading the data'
		}))
	})
})

export default router