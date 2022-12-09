import { ObjectId } from 'mongodb';
import { Course } from 'src/base/courses/interfaces/courses.interface';
import { Project } from 'src/base/projects/interfaces/projects.interface';
import { User } from 'src/base/users/interfaces/users.interface';

export interface Group {
	_id?: ObjectId;
	title: string;
	scrumMaster: User;
	groupNumber: number;
	participants: Array<User>;
	course: Course;
	project: Project;
}
