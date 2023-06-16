<template>
	<div
		class="font-semibold text-gray-900 dark:text-white"
		v-if="Object.keys(course.oneItems).length > 0"
	>
		<img
			class="cover h-72 w-screen object-cover object-center"
			:src="
				courseById.picture && courseById.picture != ''
					? courseById.picture
					: 'https://cdn.discordapp.com/attachments/894865078824890408/1073218625718198342/Fof04PpacAQePOW.png'
			"
			alt=""
		/>
		<div class="text-center pt-4">
			<h1 class="text-4xl font-bold">{{ courseById.tag }}</h1>
		</div>
		<div class="text-center pt-4">
			<h2 class="text-xl font-bold">
				Disponible du
				<span class="underline">{{ formatDate(courseById.periodStart) }}</span>
				jusqu'au
				<span class="underline">{{ formatDate(courseById.periodEnd) }}</span>
			</h2>
		</div>
		<div class="contenu-cours">
			<h4 class="text-2xl font-bold mb-2 border-b border-gray-300">Contenu du cours</h4>
			<ul class="space-y-4">
				<li v-for="course in courses" :key="course.id">
					<div class="course-item" :class="{ open: course.open }" @click="toggleCourse(course)">
						<h5 class="text-xl font-semibold">{{ course.title }}</h5>
						<p class="text-gray-600">{{ course.description }}</p>
					</div>
					<div v-if="course.open" class="course-files bg-gray-100 p-4">
						<ul class="space-y-2">
							<li v-for="file in course.files" :key="file.id">
								<a :href="file.url" target="_blank" class="text-blue-500">{{ file.name }}</a>
							</li>
						</ul>
					</div>
				</li>
			</ul>
			<h4 class="text-2xl font-bold mb-2 mt-3 border-b border-gray-300">Groupes</h4>
			<ul class="space-y-4">
				<li v-for="(canva, index) in canvas" :key="canva.id">
					<h2 class="text-xl font-semibold">Groupe {{ index + 1 }}</h2>
					<button
						@click="goToProject(canva)"
						class="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
					>
						<Board class="mr-2" />
						<span>{{ canva.meta.title }}</span>
					</button>
				</li>
			</ul>
		</div>
	</div>
	<div class="flex w-full gap-4 justify-center mt-4">
		<div class="contenu-cours" v-if="retro">
			<h4 class="text-2xl font-bold mb-2 border-b border-gray-300 text-gray-900 dark:text-white">
				Contenu du cours
			</h4>
			<div class="flex justify-center">
				<button
					@click="goToRetro(retro)"
					class="flex justify-center items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
				>
					<Clipboard class="mr-2" />
					{{ retro.title }}
				</button>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useCoursStore } from '@/store/modules/course.store';
import { useRouter } from 'vue-router';
import Board from '@/components/common/svg/Board.vue';
import Clipboard from '@/components/common/svg/Clipboard.vue';

// get store
const course = useCoursStore();
const courseById = computed(() => course.oneItems.course);
const retro = computed(() => course.oneItems.retro);
const canvas = computed(() => course.oneItems.projects);

const router = useRouter();

const courses = [
	{
		id: 1,
		title: 'Cours 1',
		description: 'Description du cours 1',
		open: false,
		files: [
			{ id: 1, name: 'Fichier 1', url: '#' },
			{ id: 2, name: 'Fichier 2', url: '#' },
			{ id: 3, name: 'Fichier 3', url: '#' },
		],
	},
	{
		id: 2,
		title: 'Cours 2',
		description: 'Description du cours 2',
		open: false,
		files: [
			{ id: 4, name: 'Fichier 4', url: '#' },
			{ id: 5, name: 'Fichier 5', url: '#' },
			{ id: 6, name: 'Fichier 6', url: '#' },
		],
	},
	{
		id: 3,
		title: 'Cours 3',
		description: 'Description du cours 3',
		open: false,
		files: [
			{ id: 7, name: 'Fichier 7', url: '#' },
			{ id: 8, name: 'Fichier 8', url: '#' },
			{ id: 9, name: 'Fichier 9', url: '#' },
		],
	},
];

// get id from url
const _id = computed(() => {
	const url = window.location.href;
	const id = url.substring(url.lastIndexOf('/') + 1);
	return id;
});

// get openHouse by id
const getCourseById = async (_id: string) => {
	await course.getCourseById(_id);
};

const formatDate = (date) => {
	const options = {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	} as Intl.DateTimeFormatOptions;
	return new Date(date).toLocaleDateString('fr-FR', options);
};

// fetch openHouse data on mounted
onMounted(async () => {
	await getCourseById(_id.value);
});

const goToProject = (canva) => {
	router.push(`/app/agility/project/${canva._id}`);
};

const goToRetro = (retro) => {
	router.push(`/app/retrospective/${retro.slug}`);
};
</script>
<style scoped>
.display {
	display: block;
}
.display-none {
	display: none;
}
</style>
