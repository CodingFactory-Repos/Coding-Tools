import { DeepPartial } from "@/interfaces/advanced-types.interface";

export interface AuthStore {
	isAuth: boolean;
	tempAuthUser: TempAuthUSer;
	tempEmailUser: string;
	user: DeepPartial<User>;

	signup?: (this: AuthStore, data: UserCreds) => Promise<boolean> | Promise<undefined>;
	signin?: (this: AuthStore, data: UserCreds) => Promise<boolean> | Promise<undefined>;
	logout?: (this: AuthStore) => Promise<boolean> | Promise<undefined>;
	sendAnotherEmail?: (this: AuthStore, email: string) => Promise<boolean> | Promise<undefined>;
	verifyCodeToken?: (
		this: AuthStore,
		activationToken: string,
	) => Promise<boolean> | Promise<undefined>;
	forgotPassword?: (this: AuthStore, email: string) => Promise<boolean> | Promise<undefined>;
	sendNewPassword?: (
		this: AuthStore,
		password: string,
		token: string,
	) => Promise<boolean> | Promise<undefined>;
	getCurrentUser?: (this: AuthStore) => Promise<boolean> | Promise<undefined>;
}

export interface UserCreds {
	email: string;
	password: string;
	role?: number;
}

export type TempAuthUSer = Partial<UserCreds>;

export enum Roles {
	USER = 1,
	PRODUCT_OWNER = 2,
}

export interface User {
	_id?: string;
	id?: string;
	role?: Roles;
	profile?: UserProfile;
	schoolProfile?: UserSchoolProfile;
	businessProfile?: UserBusinessProfile;
	events?: {
		id: string;
		title: string;
	}[];
	myArticles?: {
		id: string;
		title: string;
	}[];
}

export interface UserProfile {
	firstName?: string;
	lastName?: string;
	email?: string;
	resume?: string;
	phone?: string;
	birthDate?: Date;
	linkedinProfile?: string;
	githubProfile?: string;
	discordTag?: string;
	picture?: string;
	background?: string;
	showGithubStat?: boolean;
	disciplinesLiked?: Array<string>;
	portfolio: string;
}

export interface UserSchoolProfile {
	groupName: string;
	campus?: string;
}

export interface UserBusinessProfile {
	disciplinesTaught: Array<string>;
	students?: Array<User>;
	companyJob: string;
	companyName: string;
	companyLink: string;
	companyLogo: string;
	workingFrom: Date;
	workingTo: Date;
}
