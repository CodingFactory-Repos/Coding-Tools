import { mongodb } from '@/config/config';
import { Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { IdeaEquipment } from './interfaces/ideasEquipments.interface';

export class IdeasEquipmentsRepository {
	static ideasEquipmentsCollection = mongodb.collection<IdeaEquipment>('ideasEquipments');

	get ideasEquipments() {
		return IdeasEquipmentsRepository.ideasEquipmentsCollection;
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

	async ideaEquipmentExist(query: Filter<IdeaEquipment>) {
		const options = { projection: { _id: 1 } };
		return this.ideasEquipments.findOne(query, options);
	}
	// Mongo repo for the ideasEquipments collection
}
