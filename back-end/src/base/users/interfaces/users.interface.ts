import { ObjectId } from 'mongodb';

export enum Roles {
	student = 0,
	productOwner = 1,
	pedago = 2,
}

export interface User {
	_id?: ObjectId;
	status?: Roles;
	profile?: UserProfile;
	hashedPassword?: string;
	disciplinesTaught?: string;
	academicYear?: AcademicYear;
	createdAt: Date | string;
}

export interface UserProfile {
	firstName?: string;
	lastName?: string;
	email?: string;
	birthDate?: Date;
	locationSite?: string;
	linkedinProfile?: string;
	profilePicture?: string;
}

export interface PedagoProfile {
	notifications: Array<Notifications>;
}

export interface Notifications {
	example: string;
	// À définir
}

export interface AcademicYear {
	title: string;
	siteLocation: string;
	created: Date;
	students?: Array<User>;
	companyWork: string;
	phoneNumber: string;
}
