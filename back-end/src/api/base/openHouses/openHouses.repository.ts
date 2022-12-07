import { mongodb } from '@/config/config';
import { ObjectId, Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { OpenHouse } from './interfaces/openHouses.interface';

export class OpenHousesRepository {
	static openHousesCollection = mongodb.collection<OpenHouse>('openHouses');

	get openHouses() {
		return OpenHousesRepository.openHousesCollection;
	}

	async createOpenHouse(query: OpenHouse) {
		return this.openHouses.insertOne(query);
	}

	async updateOneOpenHouse(
		query: Filter<OpenHouse>,
		update: Partial<OpenHouse> | UpdateFilter<OpenHouse>,
	) {
		return this.openHouses.updateOne(query, update);
	}

	async findOneAndUpdateOpenHouse(
		query: Filter<OpenHouse>,
		update: Partial<OpenHouse>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.openHouses.findOneAndUpdate(query, update, options);
	}

	async openHouseExist(query: Filter<OpenHouse>) {
		const options = { projection: { _id: 1 } };
		return this.openHouses.findOne(query, options);
	}
	// Mongo repo for the openHouses collection
}
