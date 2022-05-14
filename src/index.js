import express from 'express';
import dotenv from 'dotenv';
import { YoutubeApiProxy } from './youtubeApiProxy.js';
import { ParsingHelpers } from './parsingHelpers.js';

const app = express();
dotenv.config();

app.get('/api/opportunityCost/:videoUrl', (req, res) => {
    res.type('application/json'); 

    let videoUrl = req.params.videoUrl;
    let videoId = ParsingHelpers.getVideoIdFromUrl(videoUrl);

    YoutubeApiProxy.getMetadata(videoId, process.env.GOOGLE_API_KEY, function(data) {
        let totalSeconds = ParsingHelpers.getSecondsFromVideoDuration(data.videoDuration);
        let opportunityCost = ParsingHelpers.getTimeFromTotalSeconds(totalSeconds * data.views);

        res.send(JSON.stringify({
            views: data.views,
            time: opportunityCost
        }));
    }, function(error) {
        console.log(error);
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});