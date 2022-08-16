import mongo from "../../database.js";

class ServerOverviewRepository {
	static SummariesCollectionName = "summaries"
	static async getSiteSummary() {
		return await mongo.db?.collection(this.SummariesCollectionName).findOne({ _id: 0 });
	}

	static async updateSiteSummary(opportunityCostIncrement: number) {
		await mongo.db?.collection(this.SummariesCollectionName).updateOne(
			{ _id: 0 }, 
			{ $inc: {
				allChannelsOpportunityCost: opportunityCostIncrement
			} },
			{ upsert: true });
	}
}

export default ServerOverviewRepository;