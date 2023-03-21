import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { MaterialsRepository } from 'src/base/materials/materials.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';

@Injectable()
export class MaterialsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => MaterialsRepository))
		private usersRepository: UsersRepository,
		private materialsRepository: MaterialsRepository,
		private jwtTokenService: JwtService,
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

	async addReservation(query, update) {
		return await this.materialsRepository.addOneReservation(query, update);
	}

	// async getCurrentUser(userId: ObjectId) {
	// 	return await this.materialsRepository.getCurrentUserId(userId);
	// }
	// Business logic methods goes there...
	// Define your own methods
}
