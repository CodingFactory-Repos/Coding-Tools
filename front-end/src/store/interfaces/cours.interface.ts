export interface CoursesStore {
	items: Course[];
	idCourses: string;
}

export interface Course {
	_id?: string;
	tag: string;
	classId?: string;
	picture: string;
    language: string;
    createdAt: String;
    periodStart: String;
    periodEnd: String;
    presence:[];
	project:[];
    site: String;
    teacherId?: String;
}



