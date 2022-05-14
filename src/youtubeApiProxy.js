import axios from 'axios';

class YoutubeApiProxy {
    static getMetadata(videoId, apiKey, success, failure) {
        axios.get('https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&fields=items.contentDetails.duration,items.statistics.viewCount&id=' + videoId + '&key=' + apiKey)
        .then(function (response) {
            let videoDuration = response.data.items[0].contentDetails.duration;
            let views = response.data.items[0].statistics.viewCount

            success({
                videoDuration: videoDuration,
                views: views
            });
        })
        .catch(function (error) {
            failure(error);
        });
    }
}

export { YoutubeApiProxy };