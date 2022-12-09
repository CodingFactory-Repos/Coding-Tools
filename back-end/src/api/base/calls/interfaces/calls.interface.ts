import { ObjectId } from 'mongodb';
import { Course } from '../../courses/interfaces/courses.interface';
import { User } from '../../users/interfaces/users.interface';

export interface Calls {
	_id?: ObjectId;
	course: Course;
	createdAt: Date;
	listUsers: Array<User>;
}
