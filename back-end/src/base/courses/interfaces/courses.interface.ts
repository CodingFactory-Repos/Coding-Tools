import { ObjectId } from 'mongodb';
import { AcademicYear, User } from 'src/base/users/interfaces/users.interface';
import { Retrospective } from 'src/base/retrospectives/interfaces/retrospectives.interface';

export interface Course {
	_id?: ObjectId;
	tag: string;
	classId?: ObjectId;
	picture: string;
	language: string;
	createdAt: Date;
	periodStart: Date;
	periodEnd: Date;
	presence: [];
	project: [];
	site: string;
	teacherId?: ObjectId;
	/*
		productOwner?: User;
	academicYear?: AcademicYear;
	retrospective?: Retrospective;
	*/
}

export interface Call {
	example: string;
	// to be changed;
}
