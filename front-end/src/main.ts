import { createApp } from 'vue';
import VueKonva from 'vue-konva'

import App from './App.vue';
import router from './router';
import store from './store';


import './styles/tailwindcss.css';
import './styles/style.css';
import './styles/layout.css';
import  './utils/konva/func.ts';




// If you want to login before the application start, add a call here and store the data in the auth.store
// After the response, boot the application.

function bootVueApp() {
	const app = createApp(App);

	app.use(router);
	app.use(store);
	app.use(VueKonva);

	app.mount('#app');
	
}



bootVueApp();
