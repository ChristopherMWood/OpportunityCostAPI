import express, { Request, Response } from 'express'
import { YoutubeApiProxy } from '../../domain/proxies/youtubeApiProxy.js'
import { getSecondsFromISO8601 } from '../../domain/parsers/timeFormatParsers.js'
import ChannelRepository from '../../domain/repositories/channelRepository.js'
import VideoRepository from '../../domain/repositories/videoRepository.js' 
import { calculateCostDiff } from '../../domain/opportunityCostCalculations.js'
import logger from '../../logger.js'
 
const router = express.Router()
const DEFAULT_PAGE = 0
const DEFAULT_PAGE_SIZE = 20

router.get('/top-channels', (req: Request, res: Response) => {
	const pageParam = req.query.page as string;
	const page = pageParam ? parseInt(pageParam) : DEFAULT_PAGE;

	const pageSizeParam = req.query.pageSize as string;
	const pageSize = pageSizeParam ? parseInt(pageSizeParam) : DEFAULT_PAGE_SIZE;

	ChannelRepository.getTopChannelsByOpportunityCost(page, pageSize, (results: any) => {
		res.status(200)
		res.send(JSON.stringify(results))
	});
})

router.get('/top-videos', (req: Request, res: Response) => {
	const pageParam = req.query.page as string;
	const page = pageParam ? parseInt(pageParam) : DEFAULT_PAGE;

	const pageSizeParam = req.query.pageSize as string;
	const pageSize = pageSizeParam ? parseInt(pageSizeParam) : DEFAULT_PAGE_SIZE;

	VideoRepository.getTopVideosByOpportunityCost(page, pageSize, (results: any) => {
		res.status(200)
		res.send(JSON.stringify(results))
	});
})

router.get('/channel/:channelId', async (req: Request, res: Response) => {
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

router.get('/video/:videoId', async (req: Request, res: Response) => {
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

router.get('/:youtubeVideoId', async (req: Request, res: Response) => {
	res.type('application/json')
	const videoId = req.params.youtubeVideoId

	//TODO: FIX NULL COALLECING OPERATION HERE
	const videoData = await YoutubeApiProxy.getVideoMetadataAsync(videoId, process.env.GOOGLE_API_KEY || '');
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

	const existingVideo = await VideoRepository.getVideoAsync(responseData.videoMeta.id);
	const newCost = responseData.videoMeta.opportunityCost
	const existingCost = existingVideo?.opportunityCost || newCost
	const oppCostDiff = calculateCostDiff(existingCost, newCost)

	await VideoRepository.upsertVideoAsync(responseData);
	await ChannelRepository.upsertChannel(responseData, oppCostDiff)

	res.status(200)
	res.send(JSON.stringify(responseData))
})

export default router