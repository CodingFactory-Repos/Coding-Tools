import { ObjectId } from 'mongodb';
import { Course } from '../../courses/interfaces/courses.interface';
import { Project } from '../../projects/interfaces/projects.interface';
import { User } from '../../users/interfaces/users.interface';

export interface Group {
	_id?: ObjectId;
	title: string;
	scrumMaster: User;
	groupNumber: number;
	participants: Array<User>;
	course: Course;
	project: Project;
}
