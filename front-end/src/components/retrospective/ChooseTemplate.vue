<template>
	<!-- TODO: Put for the dark theme fields -->
	<div class="container">
		<div class="container-head">
			<h1 class="text-2xl font-bold text-[#5c5f73]">Nouvelle rétrospective</h1>
		</div>
		<div class="container-titleRetro">
			<label for="Ajouter un titre" class="text-[#5c5f73]" >Ajouter un titre</label>
			<input class="text-[#5c5f73]" type="text" name="title" v-model="titleRetro" />
		</div>
		<div class="container-select">
			<label for="Ajouter un titre" class="text-[#5c5f73]" >Associez la rétro à un cours</label>
			<select class="text-black" v-model="selectedCourse">
				<option v-for="(item, key) in allCourses" :value="key">
					{{ item.tag }}
				</option>
			</select>
		</div>
		<div class="container-desc">
			<h2 class="text-[#5c5f73]">Choisissez un template</h2>
		</div>
		<div class="container-templates">
			<button @click="newRetro(1)" class="container-templates-card">
				<div class="container-templates-card-img">
					<img
						src="@/assets/imgs/retrospectiveImgs/undraw_loving_it_re_jfh4.svg"
						alt="Illustation"
					/>
				</div>
				<div class="container-templates-card-title text-[#5c5f73]">Mad | Sad | Glad</div>
			</button>
			<button @click="newRetro(2)" class="container-templates-card">
				<div class="container-templates-card-img">
					<img
						src="@/assets/imgs/retrospectiveImgs/undraw_showing_support_re_5f2v.svg"
						alt="Illustation"
					/>
				</div>
				<div class="container-templates-card-title text-[#5c5f73]">Liked | Learned | Lacked</div>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Course } from '@/store/interfaces/course.interface';
import Swal from 'sweetalert2';


export default defineComponent({
	props: {
		allCourses: { type: Array<Course>, required: true },
	},
	setup(props) {
		const retrospectiveStore = useRetrospectiveStore();
		const titleRetro = ref('');
		const router = useRouter();
		const selectedCourse = ref('')

		const newRetro = async (option: number) => {
			if (titleRetro.value === "" || selectedCourse.value === "") {
				Swal.fire({
					title: "Ooooops",
					text: "You have to fill the inputs if you want to create a new retro",
					icon: 'warning',
					showCancelButton: false,
					cancelButtonColor: '',
					focusConfirm: false,
					cancelButtonText: 'Cancel',
					confirmButtonColor: 'red',
					confirmButtonText: 'I understand',
					reverseButtons: true,
				})
				return;
			}
			const retro = {
				title: titleRetro.value,
				optionTemplate: option,
				participants: [],
				postits: {
					1: [],
					2: [],
					3: []
				},
				endedAt: null,
				isRetroEnded: false,
				isLocked: false,
				isTimerRunning: false,
				timerInterval: null,
				timePassed: 0,
				associatedCourse: props.allCourses[selectedCourse.value],
				allowedPeers: [],
			}

			const createdRetro = await retrospectiveStore.createNewRetro(retro)
			console.log("createRetro", createdRetro);

			if (createdRetro) {
				router.push(`/app/retrospective/${createdRetro.slug}`);
			}
		};

		return {
			titleRetro,
			newRetro,
			selectedCourse,
		};
	},
});
</script>

<style lang="scss" scoped>
button {
	background-color: initial;
	font-size: initial;
	font-weight: initial;
	padding: initial;
}

input {
	background-color: initial;
}

.container {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	&-head {
		display: flex;
	}

	&-titleRetro {
		display: flex;
		flex-direction: column;

		input {
			border: 1px solid #062a79;
			border-radius: 8px;
		}
	}
	&-select {
		display: flex;
		flex-direction: column;
		select {
			border: 1px solid #062a79;
			border-radius: 8px;
		}
	}

	&-desc {
		display: flex;
	}

	&-templates {
		display: flex;
		gap: 0.5rem;

		&-card {
			align-items: center;
			display: flex;
			flex-direction: column;
			width: 100%;
			border: 1px solid #062a79;

			&-img {
				display: flex;
				justify-content: center;
				height: fit-content;
			}

			img {
				width: 30%;
				height: 150px;
			}
		}
	}
}
</style>
