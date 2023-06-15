<template>
	<div v-if="Object.keys(course.oneItems).length > 0">
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
		<div class="cours-detail bg-grey-800 mb-5">
			<div class="corps-enseignant">
				<h4 class="text-2xl font-bold mb-2 border-b border-gray-300">Corps enseignant du cours</h4>

				<ul class="space-y-2">
					<li v-for="teacher in courseById.teachers" :key="teacher.id">
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
		<div class="flex bg-slate-300 w-full gap-4 justify-center" v-if="canvas.length > 0">
			<div v-for="canva in canvas">
				<button
					@click="goToProject(canva)"
					class="gradiant left-4 bottom-0 md:bottom-[unset] bg-[#24292E] hover:bg-[#24292E99] shadow rounded-lg p-4"
				>
					{{ canva.meta.title }}
				</button>
			</div>
		</div>
		<div class="flex bg-slate-400 w-full gap-4 justify-center mt-4" v-if="retro">
			<button
				@click="goToRetro(retro)"
				class="gradiant left-4 bottom-0 md:bottom-[unset] bg-[#24292E] hover:bg-[#24292E99] shadow rounded-lg p-4"
			>
				{{ retro.title }}
			</button>
		</div>
	</div>
	<button
		type="button"
		@click="
			() => {
				router.push('/app/ressource/cours');
			}
		"
	>
		Retour
	</button>
</template>
<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useCoursStore } from '@/store/modules/course.store';
import { useRouter } from 'vue-router';

// get store
const course = useCoursStore();
const courseById = computed(() => course.oneItems.course);
const retro = computed(() => course.oneItems.retro);
const canvas = computed(() => course.oneItems.projects);

const router = useRouter();

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
