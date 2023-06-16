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
			<button
				type="submit"
				@click="router.push('/app/blog/stats')"
				class="font-bold rounded-lg text-xs md:text-sm px-3 py-2 focus:outline-none gap-2 bg-blue-700"
			>
				<span class="text-white"> Voir les statistiques </span>
			</button>
		</div>

		<div class="mt-8 md:mt-10">
			<div v-if="windowWidth >= 1024" class="flex justify-center space-x-2 md:space-x-4">
				<button v-for="tab in tabs" :key="tab.id" :class="tabClass(tab)" @click="changeTab(tab.id)">
					{{ tab.label }}
				</button>
			</div>
			<div v-else class="flex justify-center space-x-2 md:space-x-4">
				<select
					v-model="activeTab"
					class="block w-full md:w-auto bg-white text-black border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
				>
					<option v-for="tab in tabs" :key="tab.id" :value="tab.id">
						{{ tab.label }}
					</option>
				</select>
			</div>

			<div class="mt-5 mb-5">
				<input
					type="text"
					v-model="searchQuery"
					id="default-search"
					class="block m-auto w-1/4 p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					:placeholder="
						activeTab === 'infos'
							? 'Rechercher une info...'
							: activeTab === 'tutos'
							? 'Rechercher un tutoriel..'
							: activeTab === 'events'
							? 'Rechercher un événement..'
							: activeTab === 'liked'
							? 'Rechercher un article liké..'
							: activeTab === 'participate'
							? 'Rechercher un article auquel vous participez..'
							: 'Rechercher un article..'
					"
				/>
			</div>

			<div v-for="(tab, index) in tabs" :key="`artcile_${index}`">
				<div v-if="activeTab === tab.id">
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

					<!-- v-if="
							(filteredItems(tab.id).length < 1 || !filteredItems(tab.id).length) &&
							searchQuery.length > 0
						" -->
					<div
						class="flex flex-col justify-center items-center h-auto"
					>
						<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Aucun article trouvé</h1>
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

// Create a reactive variable to store the searchBar value
const searchQuery = ref('');

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
		return +a.date - +b.date;
	});
});

// Redirect the user to the article's creation page
const redirectNewArticle = () => {
	router.push('/app/blog/new');
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
	try {
		// Sort the items by date
		const sortedItems = items.value.sort((a, b) => {
			return +b.date - +a.date
		});

		// Filter the items based on the searchBar value
		const searchResult = sortedItems.filter((item) => {
			const titleMatch = item.title.toLowerCase().includes(searchQuery.value.toLowerCase());
			const contentMatch = item.content.toLowerCase().includes(searchQuery.value.toLowerCase());
			return titleMatch || contentMatch;
		});

		// Filter the items based on the active tab
		switch (tabId) {
			case 'infos':
				return searchResult.filter((item) => item.type === 'Infos');
			case 'tutos':
				if (user.value.role === 2 || user.value.role === 3) {
					return searchResult.filter((item) => item.type === 'Tuto');
				} else {
					return searchResult.filter((item) => item.type === 'Tuto' && item.status === 'Accepted');
				}
			case 'events':
				return searchResult.filter((item) => item.type === 'Evenement');
			case 'liked':
				return searchResult.filter(
					(item) => item.likes && item.likes.some((like) => like.id === user.value._id),
				);
			case 'participate':
				return searchResult.filter(
					(item) =>
						item.participants &&
						item.participants.some((participant) => participant._id === user.value._id),
				);
			case 'all':
				return searchResult.filter(
					(item) =>
						item.type === 'Infos' ||
						item.type === 'Evenement' ||
						(item.type === 'Tuto' && item.status === 'Accepted'),
				);
		}

		return searchResult;
	} catch(err) {
		return [];
	}
};

//Call the getArticles method when the component is created
onMounted(async () => {
	await articleStore.getArticle();
});
</script>

<style scoped>
.margin {
	width: fit-content;
}
</style>
