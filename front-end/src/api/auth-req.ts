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
	http.post<IStatus>('/auth/ask-activation-token', { email });
};

export const apiTryAccountActivate = async (activationToken: string) => {
	return http.post<IStatus>('/auth/activate', { activationToken });
};

export const apiTrySendResetPasswordEmail = async (email: string) => {
	http.post<IStatus>('/auth/ask-reset-token', { email });
};

export const apiTryResetPassword = async (password: string, resetToken: string) => {
	return http.post<IStatus>('/auth/reset-password', { password, resetToken });
};

export const apiTryCheckResetToken = async (resetToken: string) => {
	return http.post<IStatus>('/auth/reset-token-check', { resetToken });
};
