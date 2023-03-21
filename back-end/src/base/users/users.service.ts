import { UsersRepository } from 'src/base/users/users.repository';
import { Injectable, forwardRef, Inject } from '@nestjs/common';

@Injectable()
export class UsersService {
	constructor(
		@Inject(forwardRef(() => UsersRepository))
		private usersRepository: UsersRepository
	) {

	}

	async getAllStudents() {
		const query = { role: 1 };
		const students = await this.usersRepository.findUser(query);
		return students;
	}
}
