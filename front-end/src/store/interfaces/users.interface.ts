import { ObjectId } from 'mongodb';

export enum Roles {
	student = 1,
	productOwner = 2,
	pedago = 3,
}

export interface User {
	_id?: ObjectId;
	role?: Roles;
	profile?: UserProfile;
	schoolProfile?: UserSchoolProfile;
	businessProfile?: UserBusinessProfile;
	hashedPassword?: string;
	createdAt?: Date | string;
	activationToken?: string;
	resetToken?: string;
	isVerified?: boolean;
	requireAdminValidation?: boolean;
}

export interface UserProfile {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	birthDate?: Date;
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
	students?: Array<ObjectId>;
	companyJob: string;
	companyName: string;
	companyLink: string;
	companyLogo: string;
	workingFrom: Date;
	workingTo: Date;
}

export interface PedagoProfile {
	notifications: Array<Notifications>;
}

export interface Notifications {
	example: string;
	// À définir
}

//! What's the point of this ?
export interface AcademicYear {
	title: string;
	siteLocation: string;
	created: Date;
	students?: Array<User>;
	companyWork: string;
	phoneNumber: string;
}
