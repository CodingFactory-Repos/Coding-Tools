<template>
	<div class="mb-5"></div>
	<form @submit.prevent="submitModification()">
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
                <option v-for="member in this.members" :value="membersId[members.indexOf(member)]" :selected="(member == members[membersId.indexOf(this.task.attributedTo)])?true:false">{{ member }}</option>
                <!--<option value="6482d701e5f59d8b311c7110">Test</option>-->
            </select>
		</div>

		<Button
			type="submit"
			@click="this.edit=true;"
			class="text-white font-bold rounded-lg text-l px-4 py-2 focus:outline-none gap-2 gradiant"
		>
			Modifier
		</Button>
		<Button
			type="submit"
			@click="this.edit=false;"
			class="text-white font-bold rounded-lg text-l px-4 py-2 focus:outline-none gap-2 gradiant ml-4"
		>
			Supprimer
		</Button>
	</form>
</template>

<script lang="ts">
import { http } from '@/api/network/axios';

export default {
	name: 'TaskForm',
	props: {
        task: Object,
		members: Array,
		membersId: Array,
	},
	data() {
		return {
			title: this.task.title,
            description: this.task.description,
            attributedTo: this.task.attributedTo,
			attributedToName: this.members[this.membersId.indexOf(this.task.attributedTo)],
			edit: true,
		};
	},
	setup(props) {
		console.log('Props: ',props);
	},
	mounted() {
		console.log('Personne attribuée: ', this.members[this.membersId.indexOf(this.task.attributedTo)])
	},
	methods: {
		submitModification() {
			if (this.edit) {
				this.updateTask();
			} else {
				this.deleteTask();
			}
		},
        updateTask() {
			http.put(`/stories/update/${this.task._id}`, {
                title: this.title,
                description: this.description,
                attributedTo: this.attributedTo,
			}).then((res) => {
				console.log(res);
				this.$emit('close');
			});
			//console.log("updateTaskPosition: ", taskId+" "+column);
		},
		deleteTask() {
			http.delete(`/stories/delete/${this.task._id}`).then((res) => {
				console.log(res);
				this.$emit('close');
			});
		}
	}
};

</script>
