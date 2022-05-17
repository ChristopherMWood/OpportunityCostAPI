import express from 'express';
import dotenv from 'dotenv';
import { YoutubeApiProxy } from './youtubeApiProxy.js';
import { ParsingHelpers } from './parsingHelpers.js';

const app = express();
dotenv.config();

if (!process.env.PORT || !process.env.GOOGLE_API_KEY) {
    throw new Error('ERROR: PORT or GOOGLE_API_KEY environment variable has not been correctly set!');
}

app.get('/api/opportunityCost/:youtubeVideoId', (req, res) => {
    res.type('application/json'); 

    let videoId = req.params.youtubeVideoId;

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
        console.log(error);
        res.status(400);
        res.send(JSON.stringify({
            message: 'An unknown error occured loading the data'
        }));
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});