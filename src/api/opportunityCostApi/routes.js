import express from 'express';
import { YoutubeApiProxy } from './youtubeApiProxy.js';
import { ParsingHelpers } from './parsingHelpers.js';

const router = express.Router();

router.get('/:youtubeVideoId', (req, res) => {
    res.type('application/json'); 

    const videoId = req.params.youtubeVideoId;

    YoutubeApiProxy.getMetadata(videoId, process.env.GOOGLE_API_KEY, function(data) {
        const videoSeconds = ParsingHelpers.getSecondsFromVideoDuration(data.videoDuration);
        const totalSecondsOfViews = data.views * videoSeconds;
        res.status(200);
        res.send(JSON.stringify({
            views: data.views,
            totalSeconds: totalSecondsOfViews,
            formattedTime: ParsingHelpers.getTimeFromTotalSeconds(totalSecondsOfViews)
        }));
    }, function(error) {
        res.status(400);
        res.send(JSON.stringify({
            message: 'An unknown error occured loading the data'
        }));
    });
});

router.get('/top', (req, res) => {
    res.status(200);
    res.send(JSON.stringify({
        message: 'Not implemented yet'
    }));
});

export default router;