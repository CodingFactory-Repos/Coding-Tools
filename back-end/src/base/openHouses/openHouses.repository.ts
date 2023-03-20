import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { OpenHouse } from 'src/base/openHouses/interfaces/openHouses.interface';

@Injectable()
export class OpenHousesRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get openHouses() {
		return this.db.collection<OpenHouse>('openHouses');
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

	async findOne(query: Filter<OpenHouse>, options: FindOneAndUpdateOptions = undefined) {
		return this.openHouses.findOne(query, options);
	}

	async openHouseExist(query: Filter<OpenHouse>) {
		const options = { projection: { _id: 1 } };
		return this.openHouses.findOne(query, options);
	}
}
