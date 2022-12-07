import { AcademicYear, User } from '../../users/interfaces/users.interface';
import { ObjectId } from 'mongodb';
import { Retrospective } from '../../retrospectives/interfaces/retrospectives.interface';

export interface Course {
	_id?: ObjectId;
	title: string;
	language: string;
	createdAt: Date;
	productOwner?: User;
	academicYear?: AcademicYear;
	retrospective?: Retrospective;
	startedAt: Date;
	files?: Array<string>;
	commentaries?: Array<string>;
	endedAt: Date;
	call: Call;
	siteLocation: string;
}

export interface Call {
	// to be changed;
}
