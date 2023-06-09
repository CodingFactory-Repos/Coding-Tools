<template>
	<img
		class="cover h-72 w-screen object-cover object-center"
		src="https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?cs=srgb&dl=pexels-pixabay-36717.jpg&fm=jpg'
			"
		alt=""
	/>
	<div class="text-center pt-4">
		<h1 class="text-4xl font-bold">TEST</h1>
	</div>
	<div class="cours-detail bg-grey-800 mb-5">
		<div class="corps-enseignant">
			<h4 class="text-2xl font-bold mb-2 border-b border-gray-300">Corps enseignant du cours</h4>

			<ul class="space-y-2">
				<li v-for="teacher in teachers" :key="teacher.id" class="flex items-center">
					<img
						:src="teacher.profilePicture"
						alt="Profile Picture"
						class="w-8 h-8 rounded-full mr-2"
					/>
					<span class="text-white-800 text-lg mb-5">{{ teacher.name }}</span>
				</li>
			</ul>
			<div class="detail-actions">
				<div class="corps-ensaignant">
					<h4 class="text-2xl font-bold mb-2 border-b border-gray-300">Détails et actions</h4>
					<ul class="space-y-2">
						<li>
							<h4 class="text-2xl font-bold mb-2">Annuaire</h4>
							<p class="text-blue-500 underline cursor-pointer">
								Afficher tout les membres de votre cours
							</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="contenu-cours">
			<h4 class="text-2xl font-bold mb-2 border-b border-gray-300">Contenu du cours</h4>
			<ul class="space-y-4">
				<li v-for="course in courses" :key="course.id">
					<div class="course-item" :class="{ open: course.open }" @click="toggleCourse(course)">
						<h5 class="text-xl font-semibold">{{ course.title }}</h5>
						<p class="text-gray-600">{{ course.description }}</p>
					</div>
					<div v-if="course.open" class="course-files">
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
				<li v-for="groupe in groupes" :key="groupe.id">
					<div class="course-item" :class="{ open: groupe.open }" @click="toggleGroupe(groupe)">
						<h5 class="text-xl font-semibold">{{ groupe.title }}</h5>
						<p class="text-gray-600">{{ groupe.description }}</p>
					</div>
					<div v-if="groupe.open" class="course-files">
						<ul class="space-y-2">
							<li v-for="file in groupe.files" :key="file.id">
								<a :href="file.url" target="_blank" class="text-blue-500">{{ file.name }}</a>
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCoursStore } from '@/store/modules/course.store';
import { useAuthStore } from '@/store/modules/auth.store';
import { useRouter } from 'vue-router';
import Folder from '@/components/common/svg/Folder.vue';

// get store
// Use the openHouses store
const courseStore = useCoursStore();
const authStore = useAuthStore();
const oneItems = computed(() => courseStore.oneItems);

const router = useRouter();

// get id from url
const _id = computed(() => {
	const url = window.location.href;
	const id = url.substring(url.lastIndexOf('/') + 1);
	return id;
});

// get openHouse by id
const getCourseById = async (_id: string) => {
	await courseStore.getCourseById(_id);
};

// fetch openHouse data on mounted
onMounted(() => {
	getCourseById(_id.value);
});
</script>
<style scoped>
.cours-detail {
	display: flex;
}

.corps-enseignant {
	flex: 1;
	padding: 20px;
	border-right: 1px solid #e5e7eb;
}

.contenu-cours {
	flex: 2;
	padding: 20px;
}

.course-item {
	cursor: pointer;
}

.course-item.open {
	font-weight: bold;
}

.course-files {
	margin-top: 10px;
}

.course-item:hover {
	background-color: rgba(0, 0, 0, 0.1);
}
</style>
