import { defineStore } from 'pinia';

import { AuthStore, AuthStoreSignin, AuthStoreSignup } from '@/store/interfaces/auth.interfaces';
import {
	apiTrySignup,
	apiTrySignin,
	apiTryLogout,
	apiTrySendNewActivationEmail,
	apiTryAccountActivate,
	apiTrySendResetPasswordEmail,
	apiTryResetPassword,
	apiTryCheckResetToken,
} from '@/api/auth-req';

import Swal from 'sweetalert2';

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
				Swal.fire({
					icon: 'error',
					title: 'An error occured when trying to register your account',
				});
				return false;
			}
		},
		async trySignin(payload: AuthStoreSignin) {
			try {
				const res = await apiTrySignin(payload).then((res) => res.data);
				if (res.status === 'ok') {
					this.isAuth = true;
					return true;
				}
				return false;
			} catch {
				Swal.fire({
					icon: 'error',
					title: 'An error occured when trying to log you in',
				});
				return false;
			}
		},
		async trySendNewActivationEmail(email: string) {
			try {
				await apiTrySendNewActivationEmail(email);
			} catch {
				Swal.fire({
					icon: 'error',
					title: 'We were not able to send you a new activation email',
				});
			}
		},
		async tryAccountActivate(token: string) {
			try {
				const res = await apiTryAccountActivate(token).then((res) => res.data);
				if (res.status === 'ok') return true;
				return false;
			} catch {
				return false;
			}
		},
		async trySendResetPasswordEmail(email: string) {
			try {
				await apiTrySendResetPasswordEmail(email);
			} catch {
				Swal.fire({
					icon: 'error',
					title: 'We were not able to send you a new reset email',
				});
			}
		},
		async tryResetPassword(password: string, token: string) {
			try {
				const res = await apiTryResetPassword(password, token).then((res) => res.data);
				if (res.status === 'ok') return true;
				return false;
			} catch {
				Swal.fire({
					icon: 'error',
					title: 'An error occured when trying to change your password',
				});
				return false;
			}
		},
		async tryCheckResetToken(token: string) {
			try {
				const res = await apiTryCheckResetToken(token).then((res) => res.data);
				if (res.status === 'ok') return true;
				return false;
			} catch {
				return false;
			}
		},
		async tryLogout() {
			try {
				const res = await apiTryLogout().then((res) => res.data);
				if (res.status === 'ok') this.isAuth = false;
			} catch {
				return;
			}
		},
	},
});
