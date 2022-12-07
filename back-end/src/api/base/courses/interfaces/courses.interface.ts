import { AcademicYear, User } from '../../users/interfaces/users.interface';

export interface Course {
	title: string;
	language: string;
	createdAt: Date;
	productOwner?: User;
	academicYear?: AcademicYear;
	retrospective?: Retrospective;
	startedAt?: Date;
	files: Array<string>;
	commentaries: Array<string>;
	endedAt: Date;
	call: Call;
	siteLocation: string;

}

export interface Retrospective {
	// To be changed;
}

export interface Call {
	// to be changed;
}
