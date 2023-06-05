import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { UsersRepository } from 'src/base/users/users.repository';


@Injectable()
export class UsersService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		private usersRepository: UsersRepository,
	) {}

	async getAllUsers() {
		return await this.usersRepository.getAllUsers();
	}
}
