import { defineStore } from 'pinia';

import { AuthStore, AuthStoreSignin, AuthStoreSignup } from '@/store/interfaces/auth.interfaces';
import {
	apiTrySignup,
	apiTrySignin,
	apiTryLogout,
	apiTrySendNewActivationEmail,
	apiTrySendResetPasswordEmail,
	apiTryResetPassword,
	apiTryCheckResetToken,
} from '@/api/auth-req';

export const useAuthStore = defineStore('template', {
	state: (): AuthStore => {
		return {
			isAuth: false,
		};
	},
	actions: {
		async trySignup(payload: AuthStoreSignup) {
			try {
				const res = await apiTrySignup(payload).then((res) => res.data);
				if (res.status === 'ok') return true;
				return false;
			} catch (e) {
				console.log(e);
				// Swagger

				return false;
			}
		},
		async trySignin(payload: AuthStoreSignin) {
			try {
				const res = await apiTrySignin(payload).then((res) => res.data);
				if (res.status === 'ok') this.isAuth = true;
			} catch {
				// Swagger
			}
		},
		async trySendNewActivationEmail(email: string) {
			try {
				await apiTrySendNewActivationEmail(email);
			} catch {
				// Swagger
			}
		},
		async trySendResetPasswordEmail(email: string) {
			try {
				await apiTrySendResetPasswordEmail(email);
			} catch {
				// Swagger
			}
		},
		async tryResetPassword(password: string, token: string) {
			try {
				const res = await apiTryResetPassword(password, token).then((res) => res.data);
				if (res.status === 'ok') return true;
				return false;
			} catch {
				// Swagger

				return false;
			}
		},
		async tryCheckResetToken(token: string) {
			try {
				const res = await apiTryCheckResetToken(token).then((res) => res.data);
				if (res.status === 'ok') return true;
				return false;
			} catch {
				// Swagger

				return false;
			}
		},
		async tryLogout() {
			try {
				const res = await apiTryLogout().then((res) => res.data);
				if (res.status === 'ok') this.isAuth = false;
			} catch {
				// Swagger
			}
		},
	},
});
