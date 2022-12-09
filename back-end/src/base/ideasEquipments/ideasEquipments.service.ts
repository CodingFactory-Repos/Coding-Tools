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

	// Business logic methods goes there...
	// Define your own methods
}
