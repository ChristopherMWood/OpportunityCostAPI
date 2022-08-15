import mongo from "../../database";
import logger from "../../logger";

class ChannelRepository {
	static collectionName = "channels";

	static async getChannelAsync(channelId: string) {
		return await mongo.db?.collection(ChannelRepository.collectionName).findOne({ _id: channelId });
	}

	static async upsertChannel(data: any, opportunityCostIncrement = 0) {
		await mongo.db?.collection("summaries").updateOne(
			{ _id: 0 }, 
			{ $inc: { allChannelsOpportunityCost: opportunityCostIncrement } },
			{ upsert: true });
		
		return await mongo.db?.collection(ChannelRepository.collectionName).updateOne({ 
			_id: data.channelMeta.id 
		}, {
			$set: {
				_id: data.channelMeta.id,
				name: data.channelMeta.name,
				updatedOn: new Date(),
			},
			$addToSet: {
				videos: data.videoMeta.id
			},
			$inc: {
				opportunityCost: opportunityCostIncrement
			},
			$setOnInsert: {
				createdOn: new Date()
			}
		}, { 
			upsert: true 
		});
	}

	static async addOrUpdateVideoOnChannel(channelId: string, videoMeta: any) {
		const channelVideoQuery = { 
			'_id': channelId,
			'videos.id': videoMeta.id
		}
		const channel = await mongo.db?.collection(ChannelRepository.collectionName).findOne(channelVideoQuery);

		if (channel) {
			//TODO: FIX TYPE IN FIND
			const video = channel.videos.find((v: { id: any; }) => v.id === videoMeta.id);

			await mongo.db?.collection(ChannelRepository.collectionName).updateOne(channelVideoQuery, {
				$inc: { opportunityCost: videoMeta.opportunityCost - video.opportunityCost },
				$set: {
					'videos.$.opportunityCost': videoMeta.opportunityCost,
					'videos.$.likes': videoMeta.opportunityCost,
					'videos.$.views': videoMeta.views,
					'videos.$.updatedOn': new Date()
				}
			});
		} else {
			await mongo.db?.collection(ChannelRepository.collectionName).updateOne({ 
				_id: channelId
			}, {
				$inc: { opportunityCost: videoMeta.opportunityCost },
				$addToSet: { videos: videoMeta }
			});
		}
	}

	static getTopChannelsByOpportunityCost(page: number, pageSize: number, success: Function) {
		const projection = { _id: 0, opportunityCost: 1, name: 1, videos: 0, createdOn: 0 }
		mongo.db?.collection(ChannelRepository.collectionName).find().skip(page * pageSize).limit(pageSize).sort({ opportunityCost: -1 }).toArray((err, result) => {			
			if (err) {
				logger.error(err);
				throw err;
			}
				
			success(result);
		  });
	}
}

export default ChannelRepository;