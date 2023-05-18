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
			{ path: 'about', component: () => import('../views/home/AboutView.vue') },
			{ path: 'forgot-password', component: () => import('../views/home/ForgotPassword.vue') },
			{
				path: 'signin',
				component: () => import('../views/home/SignIn.vue'),
				meta: { forbiddenAfterAuth: true },
			},
			{
				path: 'signup',
				component: () => import('../views/home/SignUp.vue'),
				meta: { forbiddenAfterAuth: true },
			},
		],
	},
	{
		/**
		 * This path contains every pages that are locked behind the signin and not accesible by the public.
		 * This includes agility, rollcall, materials, retrospective, blog, ...
		 */
		path: '/app',
		component: () => import('../layout/app/AppLayout.vue'),
		children: [
			{
				path: 'account',
				children: [
					{
						path: '',
						component: () => import('../views/app/AccountView.vue'),
					},
					{
						path: ':id',
						component: () => import('../views/app/RelatedProfileView.vue')
					},
				],
			},
			{
				path: 'rollcall',
				children: [
					{
						path: '',
						component: () => import('../views/calls/RollCallView.vue'),
					},
					{
						path: 'groups',
						component: () => import('../views/calls/GroupsView.vue'),
					},
				],
			},
			{ path: 'materials', component: () => import('../views/MaterialsView.vue') },
			{
				path: 'blog',
				children: [
					{
						path: '',
						component: () => import('../views/DisplayArticleView.vue'),
					},
					{
						path: ':id',
						component: () => import('../views/ShowArticleView.vue'),
					},
				],
			},
			{
				path: 'scrum',
				children: [
					{
						path: '',
						component: () => import('../views/OrganisationView.vue'),
					},
					{
						path: 'sprint',
						component: () => import('../views/SprintsView.vue'),
					},
				],
			},
			{
				path: 'retrospective',
				children: [
					{
						path: '',
						component: () => import('../views/Retrospective.vue'),
					},
					{
						path: 'new',
						component: () => import('../views/NewRetrospective.vue'),
					},
				],
			},
			{
				path: 'agility',
				children: [
					{
						path: 'dashboard',
						children: [
							{
								path: '',
								component: () => import('../views/app/AgilityDashboard.vue'),
							},
						],
					},
					{
						path: 'project/:slug',
						component: () => import('../views/app/AgilityProject.vue'),
					},
				],
			},
			{ path: 'ideas', component: () => import('../views/AddIdeasView.vue') },
		],
		meta: {
			requiresAuth: true,
		},
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
