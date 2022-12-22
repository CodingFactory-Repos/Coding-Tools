// import '@/config/env.validator';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'flowbite';

import './styles/tailwindcss.css';
import './styles/style.css';
import './styles/layout.css';

// If you want to login before the application start, add a call here and store the data in the auth.store
// After the response, boot the application.

function bootVueApp() {
	const app = createApp(App);

	app.use(router);
	app.use(store);
	app.mount('#app');
}

bootVueApp();
