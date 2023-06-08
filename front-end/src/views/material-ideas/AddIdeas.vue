<template>
	<div class="flex-1 flex justify-center items-flex-start w-full">
		<form
			class="lg:m-25 py-10 px-20 text-left py-16 px-5 rounded-lg"
			@submit.prevent="addItem"
			autocomplete="off"
		>
			<h1 class="pb-5 text-dark-secondary dark:text-dark-font text-center">
				Suggestion de matériel
			</h1>
			<!-- to add new item into the list -->
			<div class="w-full mt-30 h-10 text-sm flex">
				<input
					type="text"
					class="bg-light-secondary border text-dark-primary sm:text-sm rounded-lg block w-full p-2.5 placeholder-gray-400"
					v-model="title"
					placeholder="Ajouter une suggestion"
				/>
				<!-- Add item on click -->
				<button
					class="shrink-0 ml-2.5 rounded-lg p-2.5 dark:text-dark-font dark:disabled:bg-dark-tertiary dark:disabled:text-dark-icon dark:bg-dark-tertiary disabled:bg-light-tertiary disabled:text-light-font font-bold text-dark-primary bg-light-tertiary"
					@click="openPopUp = true"
					:disabled="title === ''"
				>
					Ajouter
				</button>
			</div>

			<!-- Show added items in list view-->
			<ul class="rounded-sm block">
				<li
					class="shadow w-full flex items-center mt-2.5 rounded-md mb-3 p-2.5 justify-between bg-light-tertiary dark:bg-dark-tertiary"
					v-for="item in items"
					@click="openInfo(item)"
				>
					<span class="grow-2 font-bold font-large text-black dark:text-dark-font">{{
						item.title
					}}</span>
					<!-- create devis on click-->

					<!-- delete item on click-->
					<button
						@click="(event) => deleteItem(item._id, event)"
						class="p-2.5 rounded-lg float-right text-dark-icon dark:text-dark-font"
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
				</li>
			</ul>
		</form>
		<InfoLayout :selectedItem="selectedItem" @getId="getId" @close="closeInfo" v-if="infoState" />
	</div>
	<PopUp :title="title" @close="closePopup" @validation="getBdd" v-if="openPopUp" />
</template>

<script>
import { http } from '@/api/network/axios';
import PopUp from './PopUp.vue';
import InfoLayout from './InfoLayout.vue';

export default {
	data() {
		return {
			newItem: '', //item before adding into array
			openPopUp: false,
			title: '',
			items: [],
			selectedItem: {},
			infoState: '',
		};
	},
	computed: {
		totalItems() {
			return this.items.length; //auto increment of 1 of each items added into array
		},
		isComplete() {
			return this.items.filter((item) => item.completed).length; //to get completed [checkbox: checked]
		},
	},
	methods: {
		async deleteItem(index, event) {
			event.stopPropagation();
			await http.delete('/ideasequipments/' + index);
			this.getBdd();

			//remove item
		},
		closePopup() {
			this.openPopUp = false;
			this.title = '';
		},
		closeInfo() {
			this.infoState = '';
		},
		async getBdd() {
			const { title, price, motiv, link, motivations } = this;
			const body = { title, price, motiv, link, motivations };
			const { data: items } = await http.get('/ideasequipments', body);
			this.items = items || [];
		},

		openInfo(item) {
			this.selectedItem = item;
			this.infoState = this.selectedItem;
		},
	},
	async created() {
		this.getBdd();
	},
	components: {
		PopUp,
		InfoLayout,
	},
};
</script>

<style lang="scss">
@import '@/styles/pop-up-backdrop.css';
</style>
