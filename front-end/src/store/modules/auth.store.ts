import { defineStore } from 'pinia';

import { AuthStore, UserCreds } from '@/store/interfaces/auth.interfaces';
import { STATUS } from '@/store/interfaces/axios.interface';
import { withErrorHandler } from '@/utils/storeHandler';

import {
	trySignup,
	trySignin,
	tryLogout,
	trySendNewActivationEmail,
	tryActivateAccount,
	trySendResetPasswordEmail,
	tryResetPassword,
	tryGetMe
} from '@/api/auth-req';

import { KeysRequired } from '@/interfaces/advanced-types.interface';
import { pick } from '@/utils/object.helper';

const authStoreDefaultState = (): AuthStore => ({
	isAuth: false,
	tempAuthUser: {},
	tempEmailUser: "",
	user: {},
})

export const useAuthStore = defineStore('auth', {
	state: (): AuthStore => authStoreDefaultState(),
	actions: {
		signup: withErrorHandler(async function(this: AuthStore, data: UserCreds) {
			const res = await trySignup(data);
			if(res.data.status !== STATUS.OK)
				throw new Error("The returned status was not expected");

			this.tempEmailUser = data.email;
			return true;
		}),
		signin: withErrorHandler(async function(this: AuthStore, data: UserCreds) {
			const res = await trySignin(data);
			if(res.data.status !== STATUS.OK)
				throw new Error("The returned status was not expected");

			await this.getCurrentUser!();
			return true;
		}),
		logout: withErrorHandler(async function(this: AuthStore) {
			const res = await tryLogout();
			if(res.data.status !== STATUS.OK)
				throw new Error("The returned status was not expected");

			this.isAuth = false;
			return true;
		}),
		sendAnotherEmail: withErrorHandler(async function(this: AuthStore, email: string) {
			const res = await trySendNewActivationEmail(email);
			if(res.data.status !== STATUS.OK)
				throw new Error("The returned status was not expected");

			return true;
		}),
		verifyCodeToken: withErrorHandler(async function(this: AuthStore, activationToken: string) {
			const res = await tryActivateAccount(activationToken);
			if(res.data.status !== STATUS.OK)
				throw new Error("The returned status was not expected");

			return true;
		}),
		forgotPassword: withErrorHandler(async function(this: AuthStore, email: string) {
			const res = await trySendResetPasswordEmail(email);
			if(res.data.status !== STATUS.OK)
				throw new Error("The returned status was not expected");

			return true;
		}),
		sendNewPassword: withErrorHandler(async function(this: AuthStore, password: string, token: string) {
			const res = await tryResetPassword(password, token);
			if(res.data.status !== STATUS.OK)
				throw new Error("The returned status was not expected");

			return true;
		}),
		getCurrentUser: withErrorHandler(async function(this: AuthStore) {
			const res = await tryGetMe();
			if(res.data.status !== STATUS.OK)
				throw new Error("The returned status was not expected");

			this.isAuth = true;
			this.user = res.data.user;
			return true;
		}),
		reset(this: AuthStore, keys?: Array<KeysRequired<AuthStore>>) {
			Object.assign(this, keys?.length
				? pick(authStoreDefaultState(), keys)
				: authStoreDefaultState() // if no keys provided, reset all
			);
		},
	}
})