import { ObjectId } from 'mongodb';
import { Course } from '../../courses/interfaces/courses.interface';
import { Group } from '../../goups/interfaces/groups.interface';

export interface Project {
	_id?: ObjectId;
	title: string;
	description: string;
	picture?: string;
	group?: Group;
	course?: Course;
}
