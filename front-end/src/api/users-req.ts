import { http } from '@/api/network/axios'

export const tryGetStudents = () => {
    return http.get('/users/students');
}