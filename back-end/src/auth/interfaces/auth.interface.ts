import { Roles } from 'src/base/users/interfaces/users.interface';

export interface AuthSignup {
	email: string;
	password: string;
	role: Roles;
}

export interface AuthSignin {
	email: string;
	password: string;
}
