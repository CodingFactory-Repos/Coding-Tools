import { ObjectId } from 'mongodb';
import { Course } from 'src/base/courses/interfaces/courses.interface';
import { User } from 'src/base/users/interfaces/users.interface';

export interface Call {
	_id?: ObjectId;
	course: Course;
	createdAt: Date;
	listUsers: Array<User>;
}
