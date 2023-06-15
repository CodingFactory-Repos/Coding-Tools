import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db, ObjectId } from 'mongodb';

import { IdeaEquipment } from 'src/base/ideasEquipments/interfaces/ideasEquipments.interface';

@Injectable()
export class IdeasEquipmentsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get ideasEquipments() {
		return this.db.collection<IdeaEquipment>('ideasEquipments');
	}

	async getAllIdeasEquipments() {
		// return this.ideasEquipments.find().toArray();
		return await this.ideasEquipments
			.aggregate([
				{
					$lookup: {
						from: 'users',
						localField: 'user',
						foreignField: '_id',
						as: 'user',
					},
				},
			])
			.toArray();
	}

	async createIdeaEquipment(query: IdeaEquipment) {
		const { user } = query;
		return this.ideasEquipments.insertOne({
			...query,
			user: new ObjectId(user),
		});
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

	async deleteOneideaEquipment(query: Filter<IdeaEquipment>) {
		return this.ideasEquipments.deleteOne(query);
	}
}
