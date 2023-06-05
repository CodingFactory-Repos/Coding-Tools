import { ObjectId } from 'mongodb';
import { AcademicYear, User } from 'src/base/users/interfaces/users.interface';
import { Retrospective } from 'src/base/retrospectives/interfaces/retrospectives.interface';

export interface Course {
	_id?: ObjectId;
	tag: string;
	classId?: ObjectId;
	picture: string;
    language: string;
    createdAt: String;
    periodStart: String;
    periodEnd: String;
    presence:[];
	project:[];
    site: String;
    teacherId?: ObjectId;
}

export interface Call {
	example: string;
	// to be changed;
}
