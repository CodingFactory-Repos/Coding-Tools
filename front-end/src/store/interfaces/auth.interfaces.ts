export interface AuthStore {
	isAuth: boolean;
	tempAuthUser: TempAuthUSer,
	tempEmailUser: string;
	user: User;

	signup?: (this: AuthStore, data: UserCreds) => Promise<boolean> | Promise<undefined>;
	signin?: (this: AuthStore, data: UserCreds) => Promise<boolean> | Promise<undefined>;
	logout?: (this: AuthStore) => Promise<boolean> | Promise<undefined>;
	sendAnotherEmail?: (this: AuthStore, email: string) => Promise<boolean> | Promise<undefined>;
	verifyCodeToken?: (this: AuthStore, activationToken: string) => Promise<boolean> | Promise<undefined>;
	forgotPassword?: (this: AuthStore, email: string) => Promise<boolean> | Promise<undefined>;
	sendNewPassword?: (this: AuthStore, password: string, token: string) => Promise<boolean> | Promise<undefined>;
	getCurrentUser?: (this: AuthStore) => Promise<boolean> | Promise<undefined>;
}

export interface UserCreds {
	email: string;
	password: string;
	userType?: number;
}

export type TempAuthUSer = Partial<UserCreds>;

export interface User {
	email?: string;
	userType?: string;
}