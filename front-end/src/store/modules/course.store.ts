import { CoursesStore, Course } from '../interfaces/cours.interface';
import { defineStore } from 'pinia';
import { withErrorHandler } from '@/utils/storeHandler';
import {getCourses} from '@/api/ressource-req';

export const useCoursStore = defineStore('course', {
	state: (): CoursesStore => {
		return {
			items: [
				{
					_id: '',
					tag: '',
					picture: '',
                    language:'',
				    createdAt: '0000-00-00T00:00:00.000+00:00',
					periodStart:'0000-00-00T00:00:00.000+00:00',
                    periodEnd: '0000-00-00T00:00:00.000+00:00',
					presence: [],
					project: [],
                    site:'',
                    teacherId: ''
				},
			],
		idCourses: "",
        }
	},
	actions: {
		//get courses in the database
		getCourse: withErrorHandler(async function () {
			const response = await getCourses();
			console.log(response.data);
		//	const items = response.data;
		//	this.items = items;
			return true;
		}),
	},
});
