import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import {
	canEnterAskValidation,
	canEnterResetPassword,
	canEnterAccountValidated,
} from '@/router/guard';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: () => import('../layout/app/AppLayout.vue'),
		children: [
			{ path: '/about', component: () => import('../views/AboutView.vue') },
			{ path: '/agility', component: () => import('../views/AgilityView.vue') },
			{ path: '/rollcall', component: () => import('../views/RollCall.vue') },
			{ path: '/materials', component: () => import('../views/MaterialsView.vue') },
			{ path: '/retrospective', component: () => import('../views/Retrospective.vue') },
			{
				name: 'newRetro',
				path: '/newRetro',
				component: () => import('../views/NewRetrospective.vue'),
			},
		],
	},
	{
		path: '/home', //! Later in the future, this path will be '/' and the old '/' will become '/app'
		component: () => import('../layout/home/HomeLayout.vue'),
		children: [
			{ path: '', component: () => import('../views/home/HomeView.vue') },
			{ path: 'signin', component: () => import('../views/home/AuthView.vue') },
			{ path: 'signup', component: () => import('../views/home/AuthView.vue') },
			{ path: 'ask-reset', component: () => import('../views/home/AskReset.vue') },
			{
				name: 'ask-validate',
				path: 'ask-validate',
				component: () => import('../views/home/AskValidation.vue'),
				beforeEnter: canEnterAskValidation,
			},
			{
				path: 'activated',
				component: () => import('../views/home/AccountValidated.vue'),
				beforeEnter: canEnterAccountValidated,
			},
			{
				path: 'reset',
				component: () => import('../views/home/ResetPassword.vue'),
				beforeEnter: canEnterResetPassword,
			},
		],
	},

	// Always leave it as last one.
	{
		path: '/:catchAll(.*)*',
		component: () => import('../views/404/ErrorNotFound.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
