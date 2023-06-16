import { http } from '@/api/network/axios';

export const tryGetAllCourses = async () => {
	return await http.get('/courses/allCourses');
};
