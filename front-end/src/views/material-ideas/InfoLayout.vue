<template>
	<div class="infoLayout bg-light-tertiary dark:bg-dark-tertiary rounded-lg">
		<button class="closeBtn rounded-lg" @click="$emit('close')">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				fill="dark-icon"
				viewBox="0 0 16 16"
			>
				<path
					d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
				/>
			</svg>
		</button>
		<span class="text-2xl text-dark-primary dark:text-dark-font">Détails</span>
		<ul>
			<!-- <li class="text-l dark-primary dark:text-dark-font" v-for="data in selectedItem">{{ data }}</li> -->

			<li>
				<span
					class="infoLayout_title text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
					>Suggestion : </span
				><br />
				<span class="text-l text-dark-primary dark:text-dark-font">
					{{ selectedItem.title }}
				</span>
			</li>
			<li>
				<span
					class="infoLayout_title text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
					>Prix : </span
				><br />
				<span class="text-l text-dark-primary dark:text-dark-font"> {{ selectedItem.price }}€ </span>
			</li>
			<li>
				<span
					class="infoLayout_desc text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
					>Description : </span
				><br />
				<span class="text-l text-dark-primary dark:text-dark-font">
					{{ selectedItem.desc }}
				</span>
			</li>
			<li>
				<span
					class="infoLayout_link text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
					>Lien : </span
				><br />
				<span class="text-l text-dark-primary dark:text-dark-font">
					{{ selectedItem.link }}
				</span>
			</li>
			<li>
				<span
					class="infoLayout_motiv text-xs !text-opacity-50 text-dark-primary dark-primary dark:text-dark-font"
					>Motivations : </span
				><br />
				<span class="text-l text-dark-primary dark:text-dark-font">
					{{ selectedItem.motiv }}
				</span>
			</li>
		</ul>
		<Comments :equipmentId="selectedItem._id"/>
	</div>
</template>
<script>

import Comments from './Comments.vue'

export default {
	props: ['selectedItem'],
	created() {
		console.log('qwack created', this.selectedItem);
		this.$emit('getId');
	},
	methods: {
		close() {
			this.$emit('close');
		},
	},
	components:{
		Comments
	},
	
};

</script>
