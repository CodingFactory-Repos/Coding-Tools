<template>
	<div class="container">
		<div class="container-head">
			<h1>Nouvelle rétrospective</h1>
		</div>
		<div class="container-titleRetro">
			<label for="Ajouter un titre">Ajouter un titre</label>
			<input type="text" name="title" v-model="titleRetro" />
		</div>
		<div class="container-desc">
			<h2>Choisissez un template</h2>
		</div>
		<div class="container-templates">
			<button @click="newRetro(1)" class="container-templates-card">
				<div class="container-templates-card-img">
					<img
						src="@/assets/imgs/retrospectiveImgs/undraw_loving_it_re_jfh4.svg"
						alt="Illustation"
					/>
				</div>
				<div class="container-templates-card-title">Mad | Sad | Glad</div>
			</button>
			<button @click="newRetro(2)" class="container-templates-card">
				<div class="container-templates-card-img">
					<img
						src="@/assets/imgs/retrospectiveImgs/undraw_showing_support_re_5f2v.svg"
						alt="Illustation"
					/>
				</div>
				<div class="container-templates-card-title">Liked | Learned | Lacked</div>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import { useRetrospectiveStore } from '@/store/retrospective.store';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
	setup() {
		const retrospectiveStore = useRetrospectiveStore();
		const titleRetro = ref('');
		const router = useRouter();
		const newRetro = (option: number) => {
			//TODO add prevent from null data
			retrospectiveStore.titleNewRetro = titleRetro.value;
			retrospectiveStore.optionTemplate = option;

			router.push('/newRetro');
		};

		return {
			titleRetro,
			newRetro,
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
