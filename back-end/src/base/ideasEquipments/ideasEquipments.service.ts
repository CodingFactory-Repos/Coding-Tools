import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { IdeasEquipmentsRepository } from 'src/base/ideasEquipments/ideasEquipments.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class IdeasEquipmentsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => IdeasEquipmentsRepository))
		private usersRepository: UsersRepository,
		private ideasEquipmentsRepository: IdeasEquipmentsRepository,
	) {}

	async getAllIdeasEquipments(){
		return this.ideasEquipmentsRepository.getAllIdeasEquipments();
	}

	async addIdea(queryIdea){
		return await this.ideasEquipmentsRepository.createIdeaEquipment(queryIdea);
	}

	async deleteIdeaEquipment(query) {
		return await this.ideasEquipmentsRepository.deleteOneideaEquipment(query);
	}

	// Business logic methods goes there...
	// Define your own methods
}
