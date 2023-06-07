import { CoursesStore, Course } from '../interfaces/cours.interface';
import { defineStore } from 'pinia';
import { withErrorHandler } from '@/utils/storeHandler';
import {createCourse, getCourses, getCoursesById} from '@/api/ressource-req';
import { isEmpty } from '@/utils/string.helper';

export const useCoursStore = defineStore('course', {
	state: (): CoursesStore => {
		return {
			items: [
				{
					_id: '',
					tag: '',
                    classTag: '',
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
            oneItems: {
                _id: '',
					tag: '',
                    classTag: '',
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
        getCourseById: withErrorHandler(async function (id: string) {
			const response = await getCoursesById(id);
			const oneItems = response.data;
			this.oneItems = oneItems;
			return true;
		}),
        addCourse: withErrorHandler(async function (
			this: CoursesStore,
			course: Course,
		) {
			const res = await createCourse(course); 
			if (res.status !== 200) return false;
			this.items.push(res.data);
			return true;
		}),
	},
  

});
