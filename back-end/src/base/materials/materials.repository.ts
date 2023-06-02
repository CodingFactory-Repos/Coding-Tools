import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db, ObjectId } from 'mongodb';

import { Material } from 'src/base/materials/interfaces/materials.interface';

@Injectable()
export class MaterialsRepository {
	constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

	get materials() {
		return this.db.collection<Material>('materials');
	}

	async getAllMaterials() {
		return this.materials.find().toArray();
	}
	async createMaterial(query: Material) {
		this.materials.insertOne(query);
		//Return the new material
		return this.materials.findOne(query);
	}

	async updateOneMaterial(
		query: Filter<Material>,
		update: Partial<Material> | UpdateFilter<Material>,
	) {
		this.materials.updateOne(query, update);
		return this.materials.findOne(query);
	}

	async findOneAndUpdateMaterial(
		query: Filter<Material>,
		update: Partial<Material>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		return this.materials.findOneAndUpdate(query, update, options);
	}

	async findOne(query: Filter<Material>, options: FindOneAndUpdateOptions = undefined) {
		return this.materials.findOne(query, options);
	}

	async materialExist(query: Filter<Material>) {
		const options = { projection: { _id: 1 } };
		return this.materials.findOne(query, options);
	}
	async deleteOneMaterial(query: Filter<Material>) {
		return this.materials.deleteOne(query);
	}
	async addOneReservation(query: Filter<Material>, update: Partial<Material>) {
		this.materials.updateOne(query, update);
		return this.materials.findOne(query);
	}
	async getMaterialById(id: string) {
		return this.materials.findOne({ _id: new ObjectId(id) });
	}
	async getPendingReservation() {
		// return only the borrowingHistory index that has the status in PENDING
		const materials = await this.materials
			.aggregate([
				{ $match: { 'borrowingHistory.status': 'PENDING' } },
				{ $unwind: '$borrowingHistory' },
				{ $match: { 'borrowingHistory.status': 'PENDING' } },
			])
			.toArray();

		return materials;
	}
	async acceptReservation(
		query: Filter<Material>,
		update: Partial<Material>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		await this.materials.findOneAndUpdate(query, update, options);
		return this.materials.findOne(query);
	}
	async declineReservation(
		query: Filter<Material>,
		update: Partial<Material>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		await this.materials.findOneAndUpdate(query, update, options);
		return this.materials.findOne(query);
	}
	async returnMaterial(
		query: Filter<Material>,
		update: Partial<Material>,
		options: FindOneAndUpdateOptions = undefined,
	) {
		await this.materials.findOneAndUpdate(query, update, options);
		return this.materials.findOne(query);
	}
}
