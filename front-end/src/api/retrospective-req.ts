import { http } from '@/api/network/axios';


export const newPostit = async (postit) => {
	return await http.post('/retrospectives/newPostit', postit)
}