import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { OpenHousesRepository } from 'src/base/openHouses/openHouses.repository';
import { UsersRepository } from 'src/base/users/users.repository';

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
}
