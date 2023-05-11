import { http } from '@/api/network/axios';
import { DeepPartial } from '@/interfaces/advanced-types.interface';
import { User } from '@/store/interfaces/auth.interfaces';
import { Status } from '@/store/interfaces/axios.interface';
import { UserProfileList } from '@/store/interfaces/user.interface';

export const trySaveUserProfile = (userProfile: DeepPartial<User>) => {
	return http.patch<Status>('/users/profile', userProfile);
};

export const tryGetClassProfileList = () => {
	return http.get<Status<{users: Array<UserProfileList>}>>('/users/profile/list');
}