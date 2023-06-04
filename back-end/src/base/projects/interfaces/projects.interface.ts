import { Course } from '@/base/courses/interfaces/courses.interface';
import { User } from '@/base/users/interfaces/users.interface';
import { ObjectId } from 'mongodb';

export interface Project {
	_id: ObjectId;
	title: string;
	course?: Course; //Si course est défini, le projet est un projet de cours, sinon c'est un projet personnel et creator est défini
	creator?: User;
}
