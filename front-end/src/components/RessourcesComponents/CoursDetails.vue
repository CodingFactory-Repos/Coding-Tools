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
	<div class="cours-detail bg-grey-800">
		<div class="corps-enseignant">
			<h4 class="text-lg font-bold mb-2 border-b border-gray-300">Corps enseignant du cours</h4>

			<ul class="space-y-2">
				<li v-for="teacher in teachers" :key="teacher.id" class="flex items-center">
					<img
						:src="teacher.profilePicture"
						alt="Profile Picture"
						class="w-8 h-8 rounded-full mr-2"
					/>
					<span class="text-white-800">{{ teacher.name }}</span>
				</li>
			</ul>
		</div>
		<div class="contenu-cours">
			<h4 class="text-lg font-bold mb-2 border-b border-gray-300">Contenu du cours</h4>
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
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			teachers: [
				{
					id: 1,
					name: 'John Doe',
					profilePicture: 'path/to/profile-picture1.jpg',
				},
				{
					id: 2,
					name: 'Jane Smith',
					profilePicture: 'path/to/profile-picture2.jpg',
				},
			],
			courses: [
				{
					id: 1,
					title: 'Course 1',
					description: 'Description of Course 1',
					open: false,
					files: [
						{
							id: 1,
							name: 'File 1.pdf',
							url: 'path/to/file1.pdf',
						},
						{
							id: 2,
							name: 'File 2.pdf',
							url: 'path/to/file2.pdf',
						},
					],
				},
				{
					id: 2,
					title: 'Course 2',
					description: 'Description of Course 2',
					open: false,
					files: [
						{
							id: 3,
							name: 'File 3.pdf',
							url: 'path/to/file3.pdf',
						},
					],
				},
				{
					id: 3,
					title: 'Course 3',
					description: 'Description of Course 3',
					open: false,
					files: [
						{
							id: 4,
							name: 'File 4.pdf',
							url: 'path/to/file4.pdf',
						},
						{
							id: 5,
							name: 'File 5.pdf',
							url: 'path/to/file5.pdf',
						},
					],
				},
			],
		};
	},
	methods: {
		toggleCourse(course) {
			course.open = !course.open;
		},
	},
};
// get store
// const course = useCoursStore();
// const oneItems = computed(() => course.oneItems);

// const router = useRouter();

// // get id from url
// const _id = computed(() => {
// 	const url = window.location.href;
// 	const id = url.substring(url.lastIndexOf('/') + 1);
// 	return id;
// });

// // get openHouse by id
// const getCourseById = async (_id: string) => {
// 	await course.getCourseById(_id);
// };

// // fetch openHouse data on mounted
// onMounted(() => {
// 	getCourseById(_id.value);
// });
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
