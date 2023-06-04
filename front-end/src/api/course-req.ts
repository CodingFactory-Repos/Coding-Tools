import { http } from '@/api/network/axios';
import { Course } from '@/store/interfaces/courses.interface';

export const getCourses = async () => {
	return http.get<Array<Course>>('/courses');
};

export const createCourse = async (Course: Partial<Course>) => {
	return http.post<Course>('/courses/create', Course);
};

export const updateCourse = async (Course: Course, id: string) => {
	return http.put<Course>(`courses/update/${id}`, Course);
};

export const deleteCourse = async (id: string) => {
	return http.delete<Course>(`courses/delete/${id}`);
};
