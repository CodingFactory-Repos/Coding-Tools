import { Inject, Injectable } from '@nestjs/common';
import { Filter, UpdateFilter, FindOneAndUpdateOptions, Db } from 'mongodb';

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
		return this.materials.insertOne(query);
	}

	async updateOneMaterial(
		query: Filter<Material>,
		update: Partial<Material> | UpdateFilter<Material>,
	) {
		return this.materials.updateOne(query, update);
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
}
