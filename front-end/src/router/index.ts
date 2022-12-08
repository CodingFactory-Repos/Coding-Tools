import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: () => import('../layout/AppLayout.vue'),
		children: [
			{ path: '', component: () => import('../views/HomeView.vue') },
			{ path: '/about', component: () => import('../views/AboutView.vue') },
			{ path: '/organisation', component: () => import('../views/OrganisationView.vue') },
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
