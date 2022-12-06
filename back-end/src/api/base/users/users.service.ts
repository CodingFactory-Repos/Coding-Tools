import { LoginDto } from '@/api/auth/dto/auth.dto';

import { UsersRepository } from '@/api/base/users/users.repository';

class UsersService {
	public usersRepository = new UsersRepository();

	// Business logic methods goes there...
}

export default UsersService;
