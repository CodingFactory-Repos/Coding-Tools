import { ObjectId } from 'mongodb';
import { AcademicYear, User } from 'src/base/users/interfaces/users.interface';
import { Retrospective } from 'src/base/retrospectives/interfaces/retrospectives.interface';

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
	example: string;
	// to be changed;
}
