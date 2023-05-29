import { http } from '@/api/network/axios';
import { DeepPartial } from '@/interfaces/advanced-types.interface';
import { User } from '@/store/interfaces/auth.interfaces';
import { Status } from '@/store/interfaces/axios.interface';
import { IRelatedUserProfile, UserCanvasList, UserProfileList } from '@/store/interfaces/user.interface';

export const trySaveUserProfile = (userProfile: DeepPartial<User>) => {
	return http.patch<Status>('/users/profile', userProfile);
};

export const tryGetClassProfileList = () => {
	return http.get<Status<{users: Array<UserProfileList>}>>('/users/profile/list');
}

export const tryGetRelatedUserProfile = (id: string) => {
	return http.get<Status<IRelatedUserProfile>>(`/users/profile/${id}`);
}

export const apiTryFetchUserListByRoom = (roomId: string, user: string) => {
	return http.get<Status<{users: Array<UserCanvasList>}>>(`/users/room?id=${roomId}&user=${user}`);
}