import { ProjectMeta } from './agility.interface';
import { Retrospective } from './retrospective.interface';

export interface CoursesStore {
	allCourses: Array<Course>;
	items: Array<Course>;
	idCourses: string;
	oneItems: Course;
	//uploadedFiles: File[];
}

export interface Course {
	_id?: string;
	tag: string;
	classId: string;
	picture: string;
	language: string;
	createdAt: Date;
	periodStart: Date;
	periodEnd: Date;
	presence: Array<any>;
	site: string | null;
	teacherId?: string;
	groups: Array<Group>;
	isLocked: boolean;
	messages: Array<Message>;
	projects: Array<string>;
	retro: string;
	files: string;
}

export interface Group {
	id: string;
	group: Array<string>;
}

export interface Message {
	userId: string;
	message: {
		newMessage: {
			type: string;
			text: string;
			sender_id: number;
			sender_name: string;
			date: string;
		};
	};
	date: Date;
}

export interface CourseById {
	course?: Course;
	//retro?: Retrospective;
	//projects?: Array<ProjectMeta>;
	// trellos?: Trello A Définir
}
