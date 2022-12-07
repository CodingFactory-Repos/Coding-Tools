import { mongodb } from '@/config/config';
import { Filter, UpdateFilter, FindOneAndUpdateOptions } from 'mongodb';
import { Material } from './interfaces/materials.interface';

export class MaterialsRepository {
	static materialsCollection = mongodb.collection<Material>('materials');

	get materials() {
		return MaterialsRepository.materialsCollection;
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

	async materialExist(query: Filter<Material>) {
		const options = { projection: { _id: 1 } };
		return this.materials.findOne(query, options);
	}
	// Mongo repo for the materials collection
}
