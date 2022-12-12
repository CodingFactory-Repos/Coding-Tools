import { http } from '@/api/network/axios';
import { AuthStoreSignin, AuthStoreSignup } from '@/store/interfaces/auth.interfaces';
import { IStatus } from '@/store/interfaces/axios.interface';

export const apiTrySignup = async (payload: AuthStoreSignup) => {
	return http.post<IStatus>('/auth/signup', payload);
};

export const apiTrySignin = async (payload: AuthStoreSignin) => {
	return http.post<IStatus>('/auth/signin', payload);
};

export const apiTryLogout = async () => {
	return http.post<IStatus>('/auth/logout');
};

export const apiTrySendNewActivationEmail = async (email: string) => {
	http.post<IStatus>('/auth/new-activation-email', { email });
};

export const apiTrySendResetPasswordEmail = async (email: string) => {
	http.post<IStatus>('/auth/new-reset-email', { email });
};

export const apiTryResetPassword = async (password: string, token: string) => {
	return http.post<IStatus>('/auth/reset', { password, token });
};

export const apiTryCheckResetToken = async (token: string) => {
	return http.post<IStatus>('/auth/check-reset', { token });
};
