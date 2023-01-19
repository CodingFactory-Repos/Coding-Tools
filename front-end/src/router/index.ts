import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: () => import('../layout/AppLayout.vue'),
		children: [
			{ path: '', component: () => import('../views/HomeView.vue') },
			{ path: '/about', component: () => import('../views/AboutView.vue') },
			{ path: '/signin', component: () => import('../views/AuthView.vue') },
			{ path: '/signup', component: () => import('../views/AuthView.vue') },
			{ path: '/agility', component: () => import('../views/AgilityView.vue') },
			{ path: '/rollcall', component: () => import('../views/RollCall.vue') },
			{ path: '/materials', component: () => import('../views/MaterialsView.vue') },
			{ path: '/retrospective', component: () => import('../views/Retrospective.vue') },
			{ path: '/test', component: () => import('../components/Test.vue') },
			{ path: '/blog/addArticle', component: () => import('../views/AddArticleView.vue') },
			{
				name: 'newRetro',
				path: '/newRetro',
				component: () => import('../views/NewRetrospective.vue'),
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
