import { defineStore } from 'pinia';
import { tryGetAllCourses } from '@/api/courses-req';
import { CourseStore } from './interfaces/course.interface';

const courseDefaultState = (): CourseStore => ({
	allCourses: [],
});
// We do not want this store to be reset.
// defineStore<string, RetroStore> : -> Very strict
export const useCourseStore = defineStore('course', {
	state: (): CourseStore => courseDefaultState(),
	actions: {
		async getAllCourses(this: CourseStore) {
			const resp = await tryGetAllCourses();
			if (resp.status === 200) this.allCourses = resp.data.courses;
		},
	},
});
