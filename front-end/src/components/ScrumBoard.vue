<template>
<div class="bg-blue-100 ">
	<div class="w-full h-full flex gap-3 px-5 py-2 overflow-auto">
		<div class="h-full w-1/4 flex flex-col gap-2 bg-white border border-gray-400">
			<span class="py-4 text-lg border-b border-gray-400 text-black w-full text-center">
				STORIES
			</span>
<!--
		<draggable
			class="h-full w-full flex flex-col gap-2 overflow-auto"
			v-model="stories"
			group="columns"
			@end="handleDragEnd"
		>
		  <div v-for="storyData in stories" :key="storyData.id">
			<div @click="openModal(storyData)">
			  {{ storyData}}
			  <span class="inline-block w-2 h-2 rounded-full" :style="{ backgroundColor: storyData.color }"></span>
			  {{ storyData.title }}
			</div>
		  </div>
		</draggable>-->
		
		
		<div class="w-full h-12 p-3">
	  <span @click="createCard('stories')" class="w-full h-full border border-dashed border-blue-400 flex items-center justify-center text-blue-400 font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300 ease-in-out cursor-pointer">
   		Add a STORY
 	  </span>
    </div>
		</div>
		
		<div class="h-full w-1/4 flex flex-col gap-2 bg-white border border-gray-400">
			<span class="py-4 text-lg border-b border-gray-400 text-black w-full text-center">
				TODO
			</span>
			<div class="h-full w-full flex flex-col gap-2 overflow-auto">
				<div v-for="todoData in todo" :key="todoData.id">
					<div @click="openModal(todoData)">
						{{ todoData  }}
					</div>
				</div>
			</div>
		</div>
		<div class="h-full w-1/4 flex flex-col gap-2 bg-white border border-gray-400">
			<span class="py-4 text-lg border-b border-gray-400 text-black w-full text-center">
				IN PROGRESS
			</span>
			<div class="h-full w-full flex flex-col gap-2 overflow-auto">
				<div v-for="inProgressData in inProgress" :key="inProgressData.id">
					<div @click="openModal(inProgressData)">
						{{ inProgressData }}
					</div>
				</div>
			</div>
		</div>
		<div class="h-full w-1/4 flex flex-col gap-2 bg-white border border-gray-400">
			<span class="py-4 text-lg border-b border-gray-400 text-black w-full text-center">
				DONE
			</span>
			<div class="h-full w-full flex flex-col gap-2 overflow-auto">
				<div v-for="doneData in done" :key="doneData.id">
					<div @click="openModal(doneData)">
						{{ doneData }}
					</div>
				</div>
			</div>
		</div>
	
<ModalOverlay v-if="showModal" @close="closeModal" size="lg">
		<template #body>
  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="Stories">Title :</label>
    <input v-model="form.title" type="text" id="Stories" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
  </div>

  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="acceptanceCriteria">Description :</label>
    <textarea v-model="form.description" id="acceptanceCriteria" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
  </div>
</template>

<template #footer>
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="submitForm(form)">
    Soumettre
  </button>
</template>

	</ModalOverlay>
</div>


	 <div>
	  <div class="column" id="dod-column">
		<h2>DOD</h2>
		<ul>
		  <li v-for="item in dodList" :key="item.id">
			<div class="post-it" @click="editItem(item)">{{ item.content }}</div>
		  </li>
		</ul>

		<div class="add-post-it">
		  <input type="text" v-model="newDodItem" placeholder="Add new item">
		  <button @click="addItem('dod')" class="w-full h-full border border-dashed border-blue-400 flex items-center justify-center text-blue-400 font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300 ease-in-out cursor-pointer">Add a DOD</button>
		</div>
	  </div>
  
	  <div class="column" id="dof-column">
		<h2>DOF</h2>
		<ul>
		  <li v-for="item in dofList" :key="item.id">
			<div class="post-it" @click="editItem(item)">{{ item.content }}</div>
		  </li>
		</ul>
		<div class="add-post-it">
		  <input type="text" v-model="newDofItem" placeholder="Add new item">
		  <span @click="addItem('dof')" class="w-full h-full border border-dashed border-blue-400 flex items-center justify-center text-blue-400 font-semibold hover:bg-blue-400 hover:text-white transition-all duration-300 ease-in-out cursor-pointer">Add a DOF
		  </span>
		</div>

	
	  </div>
	</div> 

</div>
</template>


<!--
	<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="Stories ">Title :</label>
				<input v-model="form.title" type="text" id="Stories " class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
			</div>
			
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="acceptanceCriteria">Description :</label>
				<textarea v-model="form.description" id="acceptanceCriteria" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
			</div>
		</template>
		<template #footer>
			<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="submitForm(form)">
				Soumettre
			</button>
		</template> -->
	





<script lang="ts" setup>
import ModalOverlay from '@/components/common/Modal.vue';
import { withErrorHandler } from '@/utils/storeHandler';
import { http } from '@/api/network/axios';
import { reactive,onMounted, ref } from 'vue';
import { defineComponent } from 'vue';


export interface ScrumCard {
  id: string;
  title: string;
  description: string;
  created: Date | string;
  updated: Date | string;
  color: string;
}

const stories = ref<ScrumCard[]>([])

const handleDragEnd = (event) => {
      const { newIndex, oldIndex } = event;
      const item = stories.value.splice(oldIndex, 1)[0];
      stories.value.splice(newIndex, 0, item);
}



defineProps<{
	semaine: number,
	stories: Array<ScrumCard>,
	todo: Array<ScrumCard>,
	inProgress: Array<ScrumCard>,
	done: Array<ScrumCard>,
}>()

const dod = reactive([]);
const dof = reactive([]);

const form = reactive({
	id: undefined,
	title: undefined,
	description: undefined,
	created: undefined,
	updated: undefined
})
const addToDod = () => {
  const newDodItem = 'Nouveau critère DOD';
  dod.push(newDodItem);
};

const addToDof = () => {
  const newDofItem = 'Nouveau critère DOF';
  dof.push(newDofItem);
};

const createCard = (value: string) => {
    form.title = 'Editer le titre';
    form.description = 'Editer la description';
    showModal.value = true;
}

const config = reactive({
  draggedItem: null,
  draggedItemIndex: -1,
});

const showModal = ref(false);

const openModal = (card: ScrumCard) => {
	form.title = card.title ?? '';
	form.description = card.description ?? '';
	form.created = card.created;
	form.updated = card.updated;
	form.id = card.id;
	showModal.value = true;
}

const closeModal = () => {
	form.id = undefined;
	form.title = undefined;
	form.description = undefined;
	form.created = undefined;
	form.updated = undefined;
	showModal.value = false;
}

const columns = reactive([
  { title: 'STORIES', cards: [] },
  { title: 'TODO', cards: [] },
  { title: 'IN PROGRESS', cards: [] },
  { title: 'DONE', cards: [] },
]);


const openForm = () => {
    form.title = '';
    form.description = '';
    showModal.value = true;
  };

const submitForm = withErrorHandler(async function(form: Partial<ScrumCard>) {
	
	if (form.title && form.description) {
	  const newCard: ScrumCard = {
		id: Math.random().toString(),
		title: form.title,
		description: form.description,
		created: new Date(),
		updated: new Date(),
		color: '#FF0000',
	  };
	  stories.value.push(newCard);
	  closeModal();
	} else {
	  console.log("Veuillez remplir tous les champs.");
	}
	

	if(form.id) {
		const res = await http.patch('/api/endpoint', form);
		console.log(res.data);
	} else {
		const res = await http.post('/api/endpoint', form);
		console.log(res.data)
	}
})

const dragStart = (fromColumnIndex, cardIndex) => {
  config.draggedItem = { fromColumnIndex, cardIndex };
};

const dragOver = (toColumnIndex, event) => {
  event.preventDefault();
};

const drop = (toColumnIndex, event) => {
  event.preventDefault();
  const { draggedItem } = config;
  if (draggedItem) {
    const { fromColumnIndex, cardIndex } = draggedItem;
    const fromColumn = columns[fromColumnIndex];
    const toColumn = columns[toColumnIndex];

    const card = fromColumn.cards.splice(cardIndex, 1)[0];
    toColumn.cards.push(card);

    config.draggedItem = null;
  }
};


const dodList = ref([]);
  const dofList = ref([]);
  const newDodItem = ref('');
  const newDofItem = ref('');
  
  const addItem = (column) => {
	if (column === 'dod') {
	  if (newDodItem.value.trim() !== '') {
		dodList.value.push({
		  id: Date.now(),
		  content: newDodItem.value
		});
		newDodItem.value = '';
	  }
	} else if (column === 'dof') {
	  if (newDofItem.value.trim() !== '') {
		dofList.value.push({
		  id: Date.now(),
		  content: newDofItem.value
		});
		newDofItem.value = '';
	  }
	}
  };
  
  const editItem = (item) => {
	console.log('Editing item:', item);
  };

  </script> 

  

<style>
.column {
  display: inline-block;
  width: 300px;
  padding: 20px;
  margin: 10px;
  background-color: #f0f0f0;
}

.add-post-it {
  margin-top: 10px;
}

.post-it {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  cursor: pointer;
}
</style>

  
 

  
  
  
  
  