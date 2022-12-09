import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { RetrospectivesRepository } from 'src/base/retrospectives/retrospectives.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class RetrospectivesService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => RetrospectivesRepository))
		private usersRepository: UsersRepository,
		private retrospectivesRepository: RetrospectivesRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods
}
