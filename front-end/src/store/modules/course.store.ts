import { withErrorHandler } from "@/utils/storeHandler";
import { defineStore } from "pinia";
import { CourseStore } from "../interfaces/course.interface";
import { http } from '@/api/network/axios';

export const useCourseStore = defineStore('course', {
    state: (): CourseStore => ({
        courses: [],
        course: {
            _id: '',
            tag: '',
            description: "",
            image: "",
            createdAt: "",
            startPeriod: "",
            endPeriod: "",
            classId: "",
            project: "",
            site: "",
            language: ""
        },
        courseLoading: false
    }),
    actions: {
        getAllCourses: withErrorHandler(async function (this: CourseStore) {
            this.courseLoading = true;
            const { data } = await http.get('/courses');
            this.courses = data.courses;
            this.courseLoading = false;
        }),
        getOneCourse: withErrorHandler(async function (this: CourseStore, id: string) {
            this.courseLoading = true;
            const { data } = await http.get(`/courses/${id}`);
            this.course = data.course;
            this.courseLoading = false;
        }),
    }
});
