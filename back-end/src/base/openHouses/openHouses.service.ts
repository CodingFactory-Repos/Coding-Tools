import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { OpenHousesRepository } from 'src/base/openHouses/openHouses.repository';
import { UsersRepository } from 'src/base/users/users.repository';
import { ObjectId } from 'mongodb';

@Injectable()
export class OpenHousesService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => OpenHousesRepository))
		private usersRepository: UsersRepository,
		private openHousesRepository: OpenHousesRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods

	async getAllHouses() {
		return await this.openHousesRepository.getAllHouses();
	}
	async getOpenHouseBy(id: ObjectId) {
		const query = { _id: new ObjectId(id) };
		return this.openHousesRepository.findOne(query);
	}
	async createOpenHouses(query) {
		return await this.openHousesRepository.createOpenHouses(query);
	}
	async getAllUsers() {
		return await this.usersRepository.getAllUsers();
	}
}
