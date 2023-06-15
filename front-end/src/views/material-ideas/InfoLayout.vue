<template>
	<div
		class="lg:relative lg:p-6 lg:w-8/12 lg:m-6 shadow h-fit p-5 mx-5 my-24 max-w-xl flex flex-col absolute bg-light-tertiary dark:bg-dark-tertiary rounded-lg"
	>
		<button
			class="self-end absolute rounded-lg text-dark-icon dark:text-dark-font"
			@click="$emit('close')"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				fill="currentColor"
				viewBox="0 0 16 16"
			>
				<path
					d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
				/>
			</svg>
		</button>
		<span class="text-2xl text-dark-primary dark:text-dark-font">Détails</span>
		<ul class="infoLayout">
			<li class="mt-3">
				<span class="text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
					>Suggestion : </span
				><br />
				<span class="text-l text-dark-primary dark:text-dark-font">
					{{ selectedItem.title }}
				</span>
			</li>
			<li class="mt-3">
				<span class="text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
					>Proposé par : </span
				><br />
				<span class="text-l text-dark-primary dark:text-dark-font">
					<!-- ICI -->
					{{ this.selectedItem.user[0].profile.firstName }}
					{{ this.selectedItem.user[0].profile.lastName }}
				</span>
			</li>
			<li class="mt-3">
				<span class="text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
					>Prix : </span
				><br />
				<span class="text-l text-dark-primary dark:text-dark-font">
					{{ selectedItem.price }}€
				</span>
			</li>
			<li class="mt-3">
				<span class="text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
					>Description : </span
				><br />
				<span class="text-l text-dark-primary dark:text-dark-font">
					{{ selectedItem.desc }}
				</span>
			</li>
			<li class="mt-3">
				<span class="text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
					>Lien : </span
				><br />
				<a
					class="text-l text-dark-primary dark:text-dark-font italic hover:text-[#783676] dark:hover:text-[#ab4d95]"
					:href="selectedItem.link"
					target="_blank"
				>
					Ouvrir le lien dans un nouvel onglet
				</a>
			</li>
			<li class="mt-3">
				<span class="text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
					>Motivations : </span
				><br />
				<span class="text-l text-dark-primary dark:text-dark-font">
					{{ selectedItem.motiv }}
				</span>
			</li>
		</ul>
		<Comments :equipmentId="selectedItem._id" />
		<Pdf :item="selectedItem" />
	</div>
</template>
<script>
import Comments from './Comments.vue';
import Pdf from './DraftPdf.vue';
export default {
	props: ['selectedItem'],

	created() {
		const [user] = this.selectedItem.user;

		this.$emit('getId');
	},
	methods: {
		close() {
			this.$emit('close');
		},
	},
	components: {
		Comments,
		Pdf,
	},
};
</script>
