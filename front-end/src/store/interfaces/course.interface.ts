import { User } from './auth.interfaces';

export interface CourseStore {
	allCourses: Array<Course>,

	getAllCourses?: (this: CourseStore) => Promise<void>;
}


export interface Course {
	_id?: string;
	tag?: string
	classId?: string;
	picture?: string;
	language?: string;
	createdAt?: Date;
	periodStart?: Date;
	periodEnd?: Date;
	presence?: Array<User>;
	project?: Array<any>; // Don't know what it is
	site?: string
}