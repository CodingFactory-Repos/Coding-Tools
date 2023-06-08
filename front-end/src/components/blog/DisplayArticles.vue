<template>
	<div class="text-center">
		<div class="text-center pt-4">
			<h1 class="text-2xl md:text-4xl mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
				Blog
			</h1>
			<button
				type="submit"
				@click="redirectNewArticle"
				class="absolute top-4 right-4 m-0 font-bold rounded-lg text-xs md:text-sm px-3 py-2 focus:outline-none gap-2 bg-blue-700"
			>
				<span class="text-white">
					<Add class="!fill-light-primary" />
				</span>
			</button>
		</div>

		<div class="mt-8 md:mt-10">
			<div class="flex justify-center space-x-2 md:space-x-4">
				<button v-for="tab in tabs" :key="tab.id" :class="tabClass(tab)" @click="changeTab(tab.id)">
					{{ tab.label }}
				</button>
			</div>
			<!-- <div v-else class="flex justify-center space-x-2 md:space-x-4">
				<select
					v-model="activeTab"
					class="block w-full md:w-auto bg-white text-black border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
				>
					<option v-for="tab in tabs" :key="tab.id" :value="tab.id">
						{{ tab.label }}
					</option>
				</select>
			</div> -->

			<div v-for="tab in tabs" :key="tab.id">
				<div v-if="activeTab === tab.id">
					<!-- <h2 class="text-2xl md:text-3xl font-bold pt-4 md:pt-5 text-gray-900 dark:text-white">
						{{ tab.label }}
					</h2> -->
					<div class="flex items-center justify-center p-2 md:p-5 mt-6">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
							<div v-for="item in filteredItems(tab.id)" :key="item._id">
								<div
									v-if="
										item.type != 'Tuto' ||
										(item.type == 'Tuto' &&
											(item.status == 'Accepted' || user.role == 2 || user.role == 3))
									"
									class="max-w-md flex flex-col justify-between items-center relative bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
								>
									<CardArticle :item="item" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import CardArticle from './CardArticle.vue';
import { useArticleStore } from '@/store/modules/article.store';
import { useAuthStore } from '@/store/modules/auth.store';
import { useRouter } from 'vue-router';
import Add from '../common/svg/Add.vue';

// Use the router
const router = useRouter();

// Use the article store and the auth store
const articleStore = useArticleStore();
const authStore = useAuthStore();

// Create a reactive variable to store the user
const user = computed(() => authStore.user);

// Create a reactive variable to store the window's width
const windowWidth = ref(window.innerWidth);
window.addEventListener('resize', () => {
	windowWidth.value = window.innerWidth;
});

// Create a reactive variable to store the articles && sort them by date
const items = computed(() => {
	// eslint-disable-next-line vue/no-side-effects-in-computed-properties
	return articleStore.items.sort((a, b) => {
		return new Date(a.date).getTime() - new Date(b.date).getTime();
	});
});

// Redirect the user to the article's creation page
const redirectNewArticle = () => {
	router.push('/app/blog/new');
};

// Fetch the articles
const getArticles = async () => {
	await articleStore.getArticle();
};

const tabs = ref([
	{ id: 'all', label: 'Tous' },
	{ id: 'infos', label: 'Infos' },
	{ id: 'tutos', label: 'Tutoriels' },
	{ id: 'events', label: 'Événements' },
	{ id: 'liked', label: 'Likes' },
	{ id: 'participate', label: 'Participations' },
]);

const activeTab = ref('all');

const tabClass = (tab) => {
	return {
		'text-blue-500': activeTab.value === tab.id,
		'text-gray-500': activeTab.value !== tab.id,
	};
};

const changeTab = (tabId) => {
	activeTab.value = tabId;
};

// Filter items based on the active tab
const filteredItems = (tabId) => {
	const sortedItems = items.value.sort((a, b) => {
		return new Date(a.date).getTime() - new Date(b.date).getTime();
	});

	switch (tabId) {
		case 'infos':
			return sortedItems.filter((item) => item.type === 'Infos');
		case 'tutos':
			return sortedItems.filter((item) => item.type === 'Tuto');
		case 'events':
			return sortedItems.filter((item) => item.type === 'Evenement');
		case 'liked':
			return sortedItems.filter(
				(item) => item.likes && item.likes.some((like) => like.id === user.value._id),
			);
		case 'participate':
			return sortedItems.filter(
				(item) =>
					item.participants &&
					item.participants.some((participant) => participant.id === user.value._id),
			);
		case 'all':
			return sortedItems.filter(
				(item) =>
					item.type === 'Infos' ||
					item.type === 'Evenement' ||
					(item.type === 'Tuto' && item.status === 'Accepted'),
			);
		default:
			return [];
	}
};

// Call the getArticles method when the component is created
onMounted(() => {
	getArticles();
});
</script>

<style scoped>
.margin {
	width: fit-content;
}
</style>
