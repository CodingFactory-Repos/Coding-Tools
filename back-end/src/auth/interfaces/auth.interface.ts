import { Roles } from 'src/base/users/interfaces/users.interface';

export interface AuthSignup {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	status: Roles;
}

export interface AuthSignin {
	email: string;
	password: string;
}
