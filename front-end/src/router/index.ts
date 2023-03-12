import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
	{
		/**
		 * This path contains every pages that aren't locked behind the signin.
		 * This includes, hero, signin, signup, about and that's it.
		 */
		path: '/',
		component: () => import('../layout/home/HomeLayout.vue'),
		children: [
			{ path: '', component: () => import('../views/home/HeroView.vue') },
			{ path: '/about', component: () => import('../views/AboutView.vue') },
			{ path: 'signin', component: () => import('../views/home/AuthView.vue') },
			{ path: 'signup', component: () => import('../views/home/AuthView.vue') },
		]
	},
	{
		/**
		 * This path contains every pages that are locked behind the signin and not accesible by the public.
		 * This includes agility, rollcall, materials, retrospective, blog, ...
		 */
		path: '/app',
		component: () => import('../layout/app/AppLayout.vue'),
		children: [
			{ path: 'rollcall', component: () => import('../views/RollCall.vue') },
			{ path: 'materials', component: () => import('../views/MaterialsView.vue') },
			{ path: 'retrospective', component: () => import('../views/Retrospective.vue') },
			//! This is not valid, please fix.
			{ path: 'blog/addArticle', component: () => import('../views/AddArticleView.vue') },
			//! This is not valid, don't use camelCase, please fix.
			{ path: 'newRetro', component: () => import('../views/NewRetrospective.vue') },
			{
				path: '/agility',
				children: [
					{
						path: 'dashboard',
						component: () => import('../layout/agility/AgilityLayout.vue'),
						children: [
							{ path: '', component: () => import('../views/agility/AgilityDashboard.vue') },
							{
								path: 'documentation',
								component: () => import('../components/agility/AgilityDocumentation.vue'),
							},
						],
					},
					{
						path: 'project/:slug',
						component: () => import('../views/agility/AgilityProject.vue'),
					},
				],
			},
		]
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
