import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

import { IdeaEquipment } from 'src/base/ideasEquipments/interfaces/ideasEquipments.interface';

@Injectable()
export class IdeasEquipmentsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get ideasEquipments() {
		return this.db.collection<IdeaEquipment>('ideasEquipments');
	}

	async createIdeaEquipment(query: IdeaEquipment) {
		return this.ideasEquipments.insertOne(query);
	}

	async updateOneIdeaEquipment(
		query: Filter<IdeaEquipment>,
		update: Partial<IdeaEquipment> | UpdateFilter<IdeaEquipment>,
	) {
		return this.ideasEquipments.updateOne(query, update);
	}

	async findOneAndUpdateIdeaEquipment(
		query: Filter<IdeaEquipment>,
		update: Partial<IdeaEquipment>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.ideasEquipments.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<IdeaEquipment>, options: FindOneAndUpdateOptions = undefined) {
		return this.ideasEquipments.findOne(query, options);
	}

	async ideaEquipmentExist(query: Filter<IdeaEquipment>) {
		const options = { projection: { _id: 1 } };
		return this.ideasEquipments.findOne(query, options);
	}
}
