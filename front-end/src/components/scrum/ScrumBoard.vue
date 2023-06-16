<template>
	<div class="w-100 mt-10">
	<div>
		<button @click="this.$emit('closeBoard')" class="back-button fixed pl-1.5 w-[2.5em] h-[2.5em] top-4 left-36 rounded-lg bg-light-primary dark:bg-dark-tertiary">
		<svg class="fill-[#9CA3AF] dark:hover:fill-white hover:fill-[#5C5F73]" xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg> 
		</button>
		
		<div class="flex justify-between align-middle font-bold dark:text-white text-[#213547] !bg-white dark:!bg-dark-highlight font-bold dark:text-[#9ca3af] text-[#213547] rounded-lg text-4xl p-3">
			<span>{{title}}</span>
			<div>
				<span>{{courseTag}}</span>
				<button @click="this.getTasks()" :title="'Rafraichîr la page'" class="mx-2 fill-[#9CA3AF] dark:hover:fill-white hover:fill-[#5C5F73] pl-[0.425rem] w-[2em] h-[2em] rounded-lg bg-light-primary dark:bg-dark-highlight">
					<svg xmlns="http://www.w3.org/2000/svg" height="1.8em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/></svg>
				</button>
			</div>
		</div> 
	</div>
	
	<div class="flex justify-center">
		<div v-for="(column, columnIndex) in columns" :key="columnIndex" v-show="columnIndex < 5" class="column bg-gray-200 rounded-lg p-2 m-4 w-1/4 flex justify-centerbg-light-primary dark:bg-dark-tertiary py-2 px-4">
		<div>
			<h3 class="flex justify-between text-2xl font-semibold mb-2 dark:text-white text-[#343a40]">{{ column.title }}
			<button @click="this.taskForm=true; this.selectedColumn=column.title;" class="fill-[#9CA3AF] dark:hover:fill-white hover:fill-[#5C5F73] pl-[0.425rem] w-[2em] h-[2em] rounded-lg bg-light-primary dark:bg-dark-highlight">
				<svg class="" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z"/></svg>
			</button>
			</h3>
			<div v-if="column.cards.length === 0" class="placeholder" @dragover="onDragOver" @drop="onDrop(columnIndex)"></div>
			<div class="flex justify-center flex-wrap">
				<div v-for="(card, cardIndex) in column.cards" :key="cardIndex" @click="editTask(card);" class="postIt text-[#343a40] bg-white p-2 bg-yellow-200 w-5/12 m-2 drop-shadow-xl" draggable="true" @dragstart="onDragStart(card, columnIndex)" @dragover="onDragOver" @drop="onDrop(columnIndex)">
					<div class="overflow-y-scroll">
						<p class="bg-yellow-100">{{ card.title }}</p>
						<p class="text-xs">{{ card.description }}</p>
						<p class="text-sm">{{ this.selectedGroupNames[this.selectedGroupIDs.indexOf(card.attributedTo)] }}</p>
					</div>
				</div> 
				</div>
			</div>
	</div>
	</div>	
	<div class="w-100 mt-2">
	<div class="flex justify-center">
		<div v-for="(column, columnIndex) in columns" :key="columnIndex" v-show="columnIndex > 4" class="column bg-gray-200 rounded-lg p-2 m-4 w-full flex justify-centerbg-light-primary dark:bg-dark-tertiary py-2 px-4">
		<div>
			<h3 class="flex justify-between text-2xl font-semibold mb-2 dark:text-white text-[#343a40]">{{ column.title }}
			<button @click="this.taskForm=true; this.selectedColumn=column.title;" class="fill-[#9CA3AF] dark:hover:fill-white hover:fill-[#5C5F73] pl-[0.425rem] w-[2em] h-[2em] rounded-lg bg-light-primary dark:bg-dark-highlight">
				<svg class="" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z"/></svg>
			</button>
			</h3>
			<div v-if="column.cards.length === 0" class="placeholder" @dragover="onDragOver" @drop="onDrop(columnIndex)"></div>
			<div  class="flex flex-wrap">
				<div v-for="(card, cardIndex) in column.cards" :key="cardIndex" @click="editTask(card);" class="postIt text-[#343a40] bg-white p-2 bg-yellow-200 w-1/5 m-2 drop-shadow-xl" draggable="true" @dragstart="onDragStart(card, columnIndex)" @dragover="onDragOver" @drop="onDrop(columnIndex)">
					<div>
						<p class="bg-yellow-100">{{ card.title }}</p>
						<p class="text-xs">{{ card.description }}</p>
						<p class="text-sm">{{ this.selectedGroupNames[this.selectedGroupIDs.indexOf(card.attributedTo)] }}</p>
					</div>
				</div>			
			</div>
		</div>
		</div>
	</div>
	</div>
	<Modal v-if="this.taskForm" @close="this.taskForm=false">
		<template #body>
			<TaskForm :boardId="this.boardId" :column="this.selectedColumn" :members="selectedGroupNames" :membersId="selectedGroupIDs" @close="this.taskForm=false; this.getTasks();"/>
		</template>
	</Modal>
	<Modal v-if="this.editTaskForm" @close="this.editTaskForm=false">
		<template #body>
			<EditTaskForm :task="this.selectedTask" :members="selectedGroupNames" :membersId="selectedGroupIDs" @close="this.editTaskForm=false; this.getTasks();"/>
		</template>
	</Modal>
</div>
</template>

<script>
import Modal from '@/components/common/Modal.vue';
import TaskForm from '@/components/scrum/TaskForm.vue';
import EditTaskForm from '@/components/scrum/EditTaskForm.vue';
import { http } from '@/api/network/axios';

export default {
	props: {
		title: String,
		boardId: String,
		projectId: String,
		selectedGroupNames: Array,
		selectedGroupIDs: Array,
		courseTag: String,
	},
	data() {
	return {
	taskForm: false,
	editTaskForm: false,
	selectedColumn: null,
	selectedTask: null,
	columns: [
	{
		title: 'Backlog',
		cards: [],
	},
	{
		title: "Critères d'acceptation",
		cards: [],
	},
	{
		title: 'To Do',
		cards: [],
	},
	{
		title: 'In Progress',
		cards: [],
	},
	{
		title: 'Done',
		cards: [],
	},
	{
		title: 'Definition of Done',
		cards: [],
	},
	{
		title: 'Definition of Fun',
		cards: [],
	},
	],
	draggedCard: null,
	};
	},
	methods: {
		onDragStart(card, columnIndex) {
			this.draggedCard = { card, columnIndex };
		},
		onDragOver(event) {
			event.preventDefault();
		},
		onDrop(targetColumnIndex) {
			if (this.draggedCard) {
				const { card, columnIndex } = this.draggedCard;
				if (columnIndex !== targetColumnIndex) {
					// Remove card from the source column
					const sourceColumn = this.columns[columnIndex];
					sourceColumn.cards.splice(sourceColumn.cards.indexOf(card), 1);

					// Add card to the target column
					const targetColumn = this.columns[targetColumnIndex];
					targetColumn.cards.push(card);
				}
				this.draggedCard = null;
				this.updateTaskPosition(card._id, this.columns[targetColumnIndex].title);
			}
		},
		getTasks() {
			http.get(`/stories/board/${this.boardId}`).then((res) => {
				this.sortTasks(res.data);
			});
		},
		editTask(task) {
			this.selectedTask = task;
			this.editTaskForm = true;
		},
		updateTaskPosition(taskId, column) {
			http.put(`/stories/update/${taskId}`, {
				column: column,
			}).then((res) => {
				this.getTasks();
			});
			//console.log("updateTaskPosition: ", taskId+" "+column);
		},
		sortTasks(tasks){
			for (let i = 0; i < this.columns.length; i++) {
				this.columns[i].cards = [];
			}
			for (let i = 0; i < tasks.length; i++) {
				if (tasks[i].column === "Backlog") {
					this.columns[0].cards.push(tasks[i]);
				} else if (tasks[i].column === "Critères d'acceptation") {
					this.columns[1].cards.push(tasks[i]);
				} else if (tasks[i].column === "To Do") {
					this.columns[2].cards.push(tasks[i]);
				} else if (tasks[i].column === "In Progress") {
					this.columns[3].cards.push(tasks[i]);
				} else if (tasks[i].column === "Done") {
					this.columns[4].cards.push(tasks[i]);
				} else if (tasks[i].column === "Definition of Done") {
					this.columns[5].cards.push(tasks[i]);
				} else if (tasks[i].column === "Definition of Fun") {
					this.columns[6].cards.push(tasks[i]);
				}
			}
		}
	},
	mounted() {
		console.log(this.selectedGroupNames);
		console.log(this.selectedGroupIDs)
		this.getTasks();
	},
components: {
	Modal,
	TaskForm,
	EditTaskForm,
	},
};
</script>

<style scoped>
.column {
display: flex;
flex-flow: column;
height: min-content;
}
.placeholder {
background-color: rgba(0, 0, 0, 0.1);
min-height: 40px;
margin-bottom: 10px;
}
.postIt{
border-radius: 10px;
aspect-ratio: 1/1;
min-width: 120px;
}
.postIt:hover{
opacity: 0.8;
cursor: pointer;
}
</style>