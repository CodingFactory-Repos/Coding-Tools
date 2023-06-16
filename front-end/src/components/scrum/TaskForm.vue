<template>
	<div class="mb-5"></div>
	<form @submit.prevent="addTask()">
		<div class="form-group relative z-0 w-full mb-6">
			<label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Titre</label
			>
			<input
				type="text"
				id="title"
				v-model="title"
				name="title"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				placeholder="Titre de la tâche"
				required
			/>

            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
				>Description</label
			>
			<input
				type="text"
				id="description"
				v-model="description"
				name="description"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
				placeholder="Description de la tâche"
				required
			/>

            <label for="attributedTo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Attributé à</label>
            <select
                id="attributedTo"
                v-model="attributedTo"
                name="attributedTo"
                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                required
            >
                <option v-for="member in this.members" :value="member">{{ member }}</option>
                <!--<option value="6482d701e5f59d8b311c7110">Test</option>-->
            </select>
		</div>

		<div class="mb-5"></div>
		<!-- Put the button in the center -->
		<Button
			type="submit"
			class="text-white font-bold rounded-lg text-l px-4 py-2 focus:outline-none gap-2 gradiant"
		>
			Créer une nouvelle tâche
		</Button>
	</form>
</template>

<script lang="ts">
import { ref } from 'vue';
import { http } from '@/api/network/axios';


let titleRef = ref('');
let descriptionRef = ref('');
let attributedToRef = ref('');


export default {
	name: 'TaskForm',
	props: {
		boardId: String,
        column: String,
        members: Array,
        membersId: Array,
	},
    mounted() {
        console.log(this.boardId);
    },
	data() {
		return {
			title: titleRef.value,
            description: descriptionRef.value,
            attributedTo: attributedToRef.value,
		};
	},
	setup(props) {
		console.log(props);
	},
	methods: {
		addTask() {
			console.log("addTask: ", this.title+" "+this.description+" "+this.attributedTo+" "+this.boardId+" "+this.column);
			const self = this;
			http.post('/stories/create', {
				title: this.title,
                description: this.description,
                attributedTo: this.membersId[this.members.indexOf(this.attributedTo)],
                column: this.column,
                board: this.boardId,
			}).then((res) => {
				console.log(res);
				self.$emit('close');
			});
		}
	}
};

</script>
