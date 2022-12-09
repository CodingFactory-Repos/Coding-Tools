import { http } from '@/api/network/axios';
import { AuthStoreSignin, AuthStoreSignup } from '@/store/interfaces/auth.interfaces';


export const apiTrySignup = async (payload: AuthStoreSignup) => {
	return http.post<IStatus>('/auth/singup', payload);
}

export const apiTrySignin = async (payload: AuthStoreSignin) => {
	return http.post<IStatus>('/auth/signin', payload);
}

export const apiTryLogout = async () => {
	return http.post<IStatus>('/auth/logout');
}