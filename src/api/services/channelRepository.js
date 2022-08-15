import mongo from "../../database.js";
import logger from "../../logger.js";

class ChannelRepository {
	static collectionName = "channels";

	static async getChannelAsync(channelId) {
		return await mongo.db.collection(ChannelRepository.collectionName).findOne({ _id: channelId });
	}

	static async upsertChannel(channelMeta) {
		return await mongo.db.collection(ChannelRepository.collectionName).updateOne({ 
			_id: channelMeta.id 
		}, {
			$set: {
				_id: channelMeta.id,
				name: channelMeta.name,
				updatedOn: new Date(),
			},
			$setOnInsert: {
				createdOn: new Date(),
				opportunityCost: 0
			}
		}, { 
			upsert: true 
		});
	}

	static async addOrUpdateVideoOnChannel(channelId, videoMeta) {
		const channelVideoQuery = { 
			'_id': channelId,
			'videos.id': videoMeta.id
		}
		const channel = await mongo.db.collection(ChannelRepository.collectionName).findOne(channelVideoQuery);

		if (channel) {
			const video = channel.videos.find(video => video.id === videoMeta.id);

			await mongo.db.collection(ChannelRepository.collectionName).updateOne(channelVideoQuery, {
				$inc: { opportunityCost: videoMeta.opportunityCost - video.opportunityCost },
				$set: {
					'videos.$.opportunityCost': videoMeta.opportunityCost,
					'videos.$.likes': videoMeta.opportunityCost,
					'videos.$.views': videoMeta.views,
					'videos.$.updatedOn': new Date()
				}
			});
		} else {
			await mongo.db.collection(ChannelRepository.collectionName).updateOne({ 
				_id: channelId
			}, {
				$inc: { opportunityCost: videoMeta.opportunityCost },
				$addToSet: { videos: videoMeta }
			});
		}
	}

	static getTopChannelsByOpportunityCost(page, pageSize, success) {
		const projection = { _id: 0, opportunityCost: 1, name: 1, videos: 0, createdOn: 0 }
		mongo.db.collection(ChannelRepository.collectionName).find().skip(page * pageSize).limit(pageSize).sort({ opportunityCost: -1 }).toArray((err, result) => {			
			if (err) {
				logger.error(err);
				throw err;
			}
				
			success(result);
		  });
	}
}

export default ChannelRepository;