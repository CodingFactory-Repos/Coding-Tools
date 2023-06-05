import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { OpenHousesRepository } from 'src/base/openHouses/openHouses.repository';


@Injectable()
export class OpenHousesService {
	constructor(
		@Inject(forwardRef(() => OpenHousesRepository))
		private openHousesRepository: OpenHousesRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods

	async getAllHouses() {
		return await this.openHousesRepository.getAllHouses();
	}
	async getOpenHouseById(id) {
		return await this.openHousesRepository.getOpenHouseById(id);
	}
	async createOpenHouses(query) {
		return await this.openHousesRepository.createOpenHouses(query);
	}

}
