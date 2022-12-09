import { defineStore } from 'pinia';

import { AuthStore, AuthStoreSignin, AuthStoreSignup } from '@/store/interfaces/auth.interfaces';
import { apiTrySignup, apiTrySignin, apiTryLogout } from '@/api/auth-req';

export const useAuthStore = defineStore('template', {
	state: (): AuthStore => {
		return {
			isAuth: false,
		};
	},
	actions: {
		async trySignup(payload: AuthStoreSignup) {
			try {
				await apiTrySignup(payload);
			} catch {
				// Swagger
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
