import { createApp } from 'vue';
import ContextMenu from '@imengyu/vue3-context-menu';
import VueDatePicker from '@vuepic/vue-datepicker';
import App from './App.vue';
import router from './router';
import store from './store';

import 'flowbite';
import '@vuepic/vue-datepicker/dist/main.css';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import './styles/scss/config.scss';
import './styles/scss/glassmorphism.scss';
import './styles/scss/temporary-notification.scss';
import './styles/tailwindcss.css';
import './styles/style.css';
import './styles/layout.css';

import '@/router/guard';
import { useAuthStore } from '@/store/modules/auth.store';
import { withErrorHandler } from '@/utils/storeHandler';

const authStore = useAuthStore(store);

withErrorHandler(async function () {
	await authStore.getCurrentUser();
	bootVueApp();
})();

function bootVueApp() {
	const app = createApp(App);

	app.component('VueDatePicker', VueDatePicker);
	app.use(ContextMenu);
	app.use(router);
	app.use(store);
	app.mount('#app');
}
