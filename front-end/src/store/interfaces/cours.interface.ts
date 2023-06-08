import { ProjectMeta } from './agility.interface';
import { Retrospective } from './retrospective.interface';

export interface CoursesStore {
	allCourses: Array<Course>,
	items: Array<Course>;
	idCourses: string;
    oneItems: CourseById;
}

export interface Course {
	_id?: string;
	tag: string;
	classTag: string;
	picture: string;
    language: string;
    createdAt: Date;
    periodStart: Date;
    periodEnd: Date;
    presence:[];
	project:[];
    site: string;
    teacherId?: string;
}


export interface CourseById {
	course?: Course;
	retro?: Retrospective;
	projects?: Array<ProjectMeta>;
	// trellos?: Trello A Définir
}