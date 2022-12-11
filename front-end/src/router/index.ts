import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

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
			{ path: '/test', component: () => import('../components/Test.vue') },
			{ path: '/blog/addArticle', component: () => import('../views/AddArticleView.vue') },
			{
				name: 'newRetro',
				path: '/newRetro',
				component: () => import('../views/NewRetrospective.vue'),
			},
		],
	}, {
		path: '/home', //! Later in the future, this path will be '/' and the old '/' will become '/app'
		component: () => import('../layout/home/HomeLayout.vue'),
		children: [
			{ path: '', component: () => import('../views/home/HomeView.vue') },
			{ path: '/signin', component: () => import('../views/home/AuthView.vue') },
			{ path: '/signup', component: () => import('../views/home/AuthView.vue') },
			{ path: '/reset', component: () => import('../views/home/ResetPassword.vue') },
			{ path: '/activate', component: () => import('../views/home/AccountActivation.vue') },
		]
	}
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
