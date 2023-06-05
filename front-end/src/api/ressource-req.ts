import { http } from '@/api/network/axios';
import { Course } from '@/store/interfaces/cours.interface';

export const getCourses = async () => {
	return http.get<Array<Course>>('/courses');
};

export const getCoursesById = async (id: string) => {
	return http.get<Course>(`/courses/${id}`);
};