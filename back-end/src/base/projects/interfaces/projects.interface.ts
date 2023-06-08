import { ObjectId } from 'mongodb';
import { Course } from 'src/base/courses/interfaces/courses.interface';

export interface Project {
	_id: ObjectId;
	title: string;
	description?: string;
	picture?: string;
	group?: Array<ObjectId>;
	participants: Array<ObjectId>;
	course?: Course;
	creator?: ObjectId;
}
