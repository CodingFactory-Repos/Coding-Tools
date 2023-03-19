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
	role?: number;
}

export type TempAuthUSer = Partial<UserCreds>;

export interface User {
	role?: string;
	profile?: UserProfile;
	schoolProfile?: UserSchoolProfile;
	businessProfile?: UserBusinessProfile;
}

export interface UserProfile {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	birthDate?: Date | string;
	location?: string;
	linkedinProfile?: string;
	githubProfile?: string;
	discordId?: string;
	profilePicture?: string;
	profileBackground?: string;
	profileResume?: string;
}

export interface UserSchoolProfile {
	groupeName: string;
}

export interface UserBusinessProfile {
	disciplinesTaught: Array<string>;
	students?: Array<User>;
	companyJob: string;
	companyName: string;
	companyLink: string;
	companyLogo: string;
	workingFrom: Date | string;
	workingTo: Date | string;
}