import { ObjectId } from "mongodb";
export interface User {
	_id?: ObjectId;
	profile: UserProfile
	status: number;
	pedago?: PedagoProfile;
	productOwner?: ProductOwnerProfile;
	student?: Student;
}


export interface UserProfile {
	firstName: string;
	lastName: string;
	password: string;
	email: string;
	birthDate: Date;
	locationSite: string;
	linkedinProfile: string;
	profilePicture: string;
}

export interface PedagoProfile {
	notifications: Array<Notifications>
}

export interface Notifications {
	// À définir
}

export interface ProductOwnerProfile {
	age: number;
	disciplinesTaught: Array<string>;
}

export interface Student {
	Age: number;
	academicYear?: AcademicYear;
}

export interface AcademicYear {
	title: string;
	siteLocation: string;
	created: Date;
	students?: Array<User>;
	companyWork: string;
	phoneNumber: string;
}
