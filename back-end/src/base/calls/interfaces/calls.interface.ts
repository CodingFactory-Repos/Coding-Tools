import { ObjectId } from 'mongodb';
import { Course } from 'src/base/courses/interfaces/courses.interface';
import { User } from 'src/base/users/interfaces/users.interface';

export interface Call {
	_id?: ObjectId;
	course: Course;
	createdAt: Date;
	listUsers: Array<User>;
}

export interface JwtQRCode {
	jwt: string;
}

export interface CourseIdObject {
	courseId: string;
}

export interface StudentIdObject {
	studentId: string;
}

export interface AbsencesParams {
	supervisor: any;
	attachments: any[];
	classObject: any;
	course: any;
	template: number;
}
