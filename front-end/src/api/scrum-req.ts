import { http } from '@/api/network/axios';
import { User, UserCreds } from '@/store/interfaces/auth.interfaces';
import { Status } from '@/store/interfaces/axios.interface';

export const trySignup = (data: UserCreds) => {
	return http.post<Status>('/auth/signup', data);
};

export const tryGetMe = async () => {
	return http.get<Status<{ user: User }>>('/auth/me');
};
