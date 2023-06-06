import { http } from '@/api/network/axios';
import { Status } from '@/store/interfaces/axios.interface';
import { Postit, Retrospective } from '@/store/interfaces/retrospective.interface';

export const createRetro = async (retro: Retrospective) => {
	return await http.post('/retrospectives/newRetro', retro);
};

export const tryGetCurrentRetro = async (slug: string) => {
	return await http.get(`/retrospectives/${slug}`);
};

export const newPostit = async (postit: Postit) => {
	return await http.post('/retrospectives/newPostit', postit);
};

export const tryGetAllRetro = async () => {
	return await http.get('/retrospectives/allRetros');
};

export const tryUpdateParticipants = async (participants: Retrospective) => {
	await http.post('/retrospectives/participants', participants);
};


export const apiTrySendRetroInvitation = (userId: string, roomId: string) => {
	return http.post(`/retrospectives/invitation/${roomId}`, { userId });
};

export const apiTryVerifyRetroInvitationToken = (token: string) => {
	return http.post<Status<{ roomId: string }>>('/retrospectives/verify-invitation', { token });
};

export const apiTryRemoveRetroUserAccess = (userEmail: string, roomId: string) => {
	return http.post<Status>(`/retrospectives/participants/${roomId}/remove-access`, { userEmail });
};