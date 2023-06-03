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

	async getAllMaterialsStats() {
		return this.materials.aggregate([{ $sort: { acquisitionDate: 1 } }, { $limit: 5 }]).toArray();
	}

	async getAllMacs() {
		return this.materials
			.aggregate([
				{
					$match: {
						type: 'Mac',
					},
				},
				{
					$group: {
						_id: '$siteLocation',
						count: { $sum: 1 },
					},
				},
				{
					$project: {
						campus: '$_id',
						count: '$count',
						_id: false,
					},
				},
			])
			.toArray();
	}

	async getMacsStatus(kind) {
		return this.materials
			.aggregate([
				{
					$match: {
						type: kind,
					},
				},
				{
					$group: {
						_id: '$status',
						count: { $sum: 1 },
					},
				},
				{
					$project: {
						status: '$_id',
						count: '$count',
						_id: false,
					},
				},
			])
			.toArray();
	}

	async getMaterialsUsed() {
		return this.materials.find({ borrowingHistory: { $exists: true } }).toArray();
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
		return this.materials.updateOne(query, update);
	}
	async getMaterialById(id: string) {
		return this.materials.findOne({ _id: new ObjectId(id) });
	}
}
