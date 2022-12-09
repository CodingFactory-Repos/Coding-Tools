export interface AuthStore {
	isAuth: boolean;
}

export interface AuthStoreSignin {
	email: string;
	password: string;
}

export interface AuthStoreSignup {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	status: number;
}
