
export interface CourseStore {
    courses: Array<Course>;
    course: Course;
    courseLoading: boolean;

    getAllCourses?: () => Promise<void>;
}

export interface Course {
    _id: string;
    tag: string;
    language: string;
    description: string;
    image: string;
    createdAt: string;
    startPeriod: string;
    endPeriod: string;
    classId: string;
    project: string;
    site: string;


}
