import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CallsRepository } from 'src/base/calls/calls.repository';
import { UsersRepository } from 'src/base/users/users.repository';

@Injectable()
export class CallsService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		@Inject(forwardRef(() => CallsRepository))
		private usersRepository: UsersRepository,
		private callsRepository: CallsRepository,
	) {}

	// Business logic methods goes there...
	// Define your own methods
}
