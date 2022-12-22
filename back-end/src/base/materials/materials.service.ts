import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { MaterialsRepository } from 'src/base/materials/materials.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class MaterialsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => MaterialsRepository))
		private usersRepository: UsersRepository,
		private materialsRepository: MaterialsRepository,
	) {}

	async getAllMaterials() {
		return await this.materialsRepository.getAllMaterials();
	}

	async createNewMaterial(query) {
		return await this.materialsRepository.createMaterial(query);
	}
	async updateMaterial(query, update) {
		return await this.materialsRepository.updateOneMaterial(query, update);
	}

	async deleteMaterial(query) {
		return await this.materialsRepository.deleteOneMaterial(query);
	}
	// Business logic methods goes there...
	// Define your own methods
}
