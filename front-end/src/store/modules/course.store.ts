import { CoursesStore, Course } from '../interfaces/cours.interface';
import { defineStore } from 'pinia';
import { withErrorHandler } from '@/utils/storeHandler';
import { createCourse, getCourses, getCoursesById } from '@/api/ressource-req';
import { tryGetAllCourses } from '@/api/courses-req';

export const useCoursStore = defineStore('course', {
	state: (): CoursesStore => {
		return {
			allCourses: [],
			items: [
				{
					_id: '',
					tag: '',
					classTag: '',
					picture: '',
					language: '',
					createdAt: null,
					periodStart: null,
					periodEnd: null,
					presence: [],
					project: [],
					site: '',
					teacherId: '',
					files: '',
				},
			],
			oneItems: {
				_id: '',
				tag: '',
				classTag: '',
				picture: '',
				language: '',
				createdAt: null,
				periodStart: null,
				periodEnd: null,
				presence: [],
				project: [],
				site: '',
				teacherId: '',
				files: '',
			},
			idCourses: '',
			//uploadedFiles: [],
		};
	},
	actions: {
		//get courses in the database
		getCourse: withErrorHandler(async function () {
			const response = await getCourses();
			const items = response.data;
			this.items = items;
			return true;
		}),
		getCourseById: withErrorHandler(async function (id: string) {
			const response = await getCoursesById(id);
			this.oneItems = response.data;
			console.log(this.oneItems);
			return true;
		}),
		addCourse: withErrorHandler(async function (this: CoursesStore, course: Course) {
			const res = await createCourse(course);
			console.log(res.data);
			if (res.status !== 200) return false;
			this.items.push(res.data);
			return true;
		}),
	},
});
