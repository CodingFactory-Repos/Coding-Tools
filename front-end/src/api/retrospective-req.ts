import { http } from '@/api/network/axios';

export const createRetro = async (retro) => {
	return await http.post('/retrospectives/newRetro', retro)
}

export const tryGetCurrentRetro = async (slug: string) => {
	return await http.get(`/retrospectives/${slug}`)
}

export const newPostit = async (postit) => {
	return await http.post('/retrospectives/newPostit', postit)
}