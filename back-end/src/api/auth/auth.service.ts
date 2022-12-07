import { LoginDto } from '@/api/auth/dto/auth.dto';

import { User } from '@/api/base/users/interfaces/users.interface';
import { UsersRepository } from '@/api/base/users/users.repository';

class AuthService {
	public usersRepository = new UsersRepository();

	public async signup(userData: LoginDto): Promise<User> {
		// Signup business logic goes here
		return {} as User;
	}

	public async login(userData: LoginDto): Promise<{ payload: string; user: User }> {
		// Login business logic goes here
		return { payload: null, user: null };
	}

	public async logout(userData: User): Promise<void> {
		// Logout business logic goes here
	}

	public async test() {
		console.log('duh');
	}
}

export default AuthService;
