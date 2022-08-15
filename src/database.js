import { MongoClient } from 'mongodb'
import logger from './logger.js';

const mongoConnectionString = `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

class Database {
  constructor() {
    logger.error('DATABSE OBJECT MADE');
    this.client = new MongoClient(mongoConnectionString);
    this.client.on('close', () => { logger.info('Database disconnected'); });
    this.client.on('reconnect', () => { logger.info('Database reconnected'); });
  }

  async init() {
    await this.client.connect();
    logger.info('Mongo DB Connection Successful');
    this.db = this.client.db();
		await this.db.collection("channels").createIndex( { opportunityCost: -1 } )
		await this.db.collection("channels").createIndex( { 'videos.opportunityCost': 1 } )
		await this.db.collection("channels").createIndex( { 'videos.id': 1 } )
  }
}

const mongo = new Database();

export default mongo;