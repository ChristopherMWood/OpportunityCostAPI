import mongo from "../../database.js";
import logger from "../../logger.js";

class ChannelRepo {
	collectionName = "channels";

	constructor() {

	}

	getChannel(channelId) {
		mongo.db.collection(this.collectionName).find({ channelId: channelId })
	}

	//INDEX BY CHANNEL ID & CHANNEL OC
	//INDEX BY VIDEO ID & VIDEO OC

	async upsertChannel(data) {
		const query = { channelId: data.channelMeta.id };
		const update = {
			$set: { 
				name: data.channelMeta.name,
				updatedOn: new Date()
			},
			$setOnInsert: {
				createdOn: new Date()
			},
			$max: {
				opportunityCost: 0,
			},
			$addToSet: {
				videos: data.videoMeta.id
			}
		};

		await mongo.db.collection(this.collectionName).updateOne(query, update, { upsert: true });
		//GET RESULTS BACK FOR IF NEW CHANNEL VS NOT

		//INSERT VIDEO SAFELY HERE
	}

	upsertVideoOnChannel(videoData) {
		//If video is already on channel CALCULATE DIFFERENCE OF NEW OPPORTUNITY COST
		var updatedOpportunityCost = 0; //MAKE THIS DIFFERENCE

		//If video is not already on channel ADD NEW OPPORTUNITY COST TO CHANNEL
		//MAKE updatedOpportunityCost OPPORTUNITY COST

		//Update Channel Opportunity Cost to be EXISTING + updatedOpportunityCost
	}

	getTopChannelsByOpportunityCost(page) {

	}

	getTopVideosByOpportunityCost(page) {
		
	}
}

const ChannelRepository = new ChannelRepo();

export default ChannelRepository;