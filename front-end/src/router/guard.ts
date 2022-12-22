import { useAuthStore } from '@/store/modules/auth.store';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

// This file listen to route before enter and route before leave.
// It manage the access of a route depending on the user permissions.

export const canEnterAskValidation = (
	to: RouteLocationNormalized,
	from: RouteLocationNormalized,
	next: NavigationGuardNext,
) => {
	const { email } = from.params || {};
	if (email === undefined) next('/error');

	to.params.email = email;
	next();
};

export const canEnterAccountValidated = async (
	to: RouteLocationNormalized,
	_from: RouteLocationNormalized,
	next: NavigationGuardNext,
) => {
	const { token } = to.query || {};
	if (token === undefined) next('/error');

	const authStore = useAuthStore();
	const isValid = await authStore.tryAccountActivate(token as string);
	if (!isValid) next('/error');

	to.query = {};
	next();
};

export const canEnterResetPassword = async (
	to: RouteLocationNormalized,
	_from: RouteLocationNormalized,
	next: NavigationGuardNext,
) => {
	const { token } = to.query || {};
	if (!token) next('/error');

	const authStore = useAuthStore();
	const isValid = await authStore.tryCheckResetToken(token as string);
	if (!isValid) next('/error');

	to.query = {};
	to.params.token = token as string;
	next();
};
