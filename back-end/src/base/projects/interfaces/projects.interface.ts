import { ObjectId } from 'mongodb';
import { Course } from 'src/base/courses/interfaces/courses.interface';
import { Group } from 'src/base/groups/interfaces/groups.interface';

export interface Project {
	_id?: ObjectId;
	title: string;
	description: string;
	picture?: string;
	group?: Group;
	course?: Course;
}
