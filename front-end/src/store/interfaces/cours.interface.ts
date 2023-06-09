export interface CoursesStore {
	items: Course[];
	idCourses: string;
	oneItems: Course;
	uploadedFiles: File[];
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
	presence: [];
	project: [];
	site: string;
	teacherId?: string;
}
