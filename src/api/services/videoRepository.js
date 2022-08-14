import mongo from "../../database.js";
import logger from "../../logger.js";

class VideoRepo {
	collectionName = "videos";

	constructor() {

	}

	getVideo(videoId) {
		mongo.db.collection(this.collectionName).find({ videoId: videoId })
	}

	async upsertVideo(data) {
		const query = { videoId: data.videoMeta.id };
		const update = {
			$set: { 
				title: data.videoMeta.title,
				likes: data.videoMeta.likes,
				views: data.videoMeta.views,
				length: data.videoMeta.length,
				opportunityCost: data.videoMeta.opportunityCost,
				updatedOn: new Date(),
				thumbnails: data.videoMeta.thumbnails
			},
			$setOnInsert: {
				channelId: data.channelMeta.id,
				publishDate: data.videoMeta.publishDate,
				createdOn: new Date()
			}
		};

		await mongo.db.collection(this.collectionName).updateOne(query, update, { upsert: true });
	}

	getTopVideosByOpportunityCost(page, pageSize, success) {
		mongo.db.collection(this.collectionName).find().skip(page * pageSize).limit(pageSize).sort({ opportunityCost: -1 }).toArray(function(err, result) {
			if (err) 
				throw err;
				
			success(result);
		  });
	}
}

const VideoRepository = new VideoRepo();

export default VideoRepository;