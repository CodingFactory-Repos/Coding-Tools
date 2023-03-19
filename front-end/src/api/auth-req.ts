import { http } from '@/api/network/axios';
import { User, UserCreds } from '@/store/interfaces/auth.interfaces';
import { Status } from '@/store/interfaces/axios.interface';

export const trySignup = (data: UserCreds) => {
	return http.post<Status>('/auth/signup', data);
}

export const trySignin = (data: UserCreds) => {
	return http.post<Status>('/auth/signin', data);
}

export const tryLogout = () => {
	return http.post<Status>('/auth/logout');
}

export const trySendNewActivationEmail = (email: string) => {
	return http.post<Status>('/auth/ask-activation-token', { email });
}

export const tryActivateAccount = (activationToken: string) => {
	return http.post<Status>('/auth/activate', { activationToken });
}

export const trySendResetPasswordEmail = (email: string) => {
	return http.post<Status>('/auth/ask-reset-token', { email });
}

export const tryResetPassword = (password: string, resetToken: string) => {
	return http.post<Status>('/auth/reset-password', { password, resetToken });
}

export const tryGetMe = async () => {
	return http.get<Status<{ user: User }>>('/auth/me');
}