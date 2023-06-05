import { CoursesStore, Course } from '../interfaces/cours.interface';
import { defineStore } from 'pinia';
import { withErrorHandler } from '@/utils/storeHandler';
import {getCourses} from '@/api/ressource-req';
import { isEmpty } from '@/utils/string.helper';

export const useCoursStore = defineStore('course', {
	state: (): CoursesStore => {
		return {
			items: [
				{
					_id: '',
					tag: '',
					picture: '',
                    language:'',
				    createdAt: null,
					periodStart:null,
                    periodEnd: null,
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
		//	console.log(response.data);
			const items = response.data;
			this.items = items;
            console.log(this.items);
			return true;
		}),
	},
  
});
