import { http } from '@/api/network/axios';
import { Status, STATUS } from '@/store/interfaces/axios.interface';
import { useAuthStore } from '@/store/modules/auth.store';
import router from '@/router';

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore();
	const isAuth = authStore.isAuth;

	try {
		// If the flag is set to true and one of the meta is present
		if (isAuth && (to.meta.requiresAuth || to.meta.forbiddenAfterAuth)) {
			// We check for the validity of the auth token
			const res = await http.post<Status>('/auth/token');
			if (res.data.status !== STATUS.OK) throw new Error('unauthorized');

			// We verify if the route require auth.
			if (to.meta.requiresAuth) return next();

			// We verify if the route is forbidden after auth.
			if (to.meta.forbiddenAfterAuth) return next(from.path || '/');
		}

		// If the flag is not set to true and the auth is required
		if (!isAuth && to.meta.requiresAuth) {
			return next('/signin');
		}

		// If none of check if valid, then we can assume the route is accessible no matter what.
		return next();
	} catch (_) {
		return next('/signin');
	}
});
