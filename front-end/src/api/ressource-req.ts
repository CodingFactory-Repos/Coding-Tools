import { http } from '@/api/network/axios';
import { Course } from '@/store/interfaces/cours.interface';

export const getCourses = async () => {
	return http.get<Array<Course>>('/courses');
};
