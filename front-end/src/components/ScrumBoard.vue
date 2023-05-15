<template>
	<div class="container">
		bonjour
		<h1 class="text-2xl font-bold mb-4">Board EduScrum - Semaine {{ semaineProp }}</h1> 

		<div class="grid grid-cols-5 gap-4">
			<!-- Colonne 1 : Stories -->
			<div class="bg-gray-100 p-4 rounded-lg">
				<h2 class="text-lg font-semibold mb-2">Stories</h2>
				<draggable v-if="storiesProp.length>0" v-model="storiesProp">
					<div v-for="task in storiesProp" :key="task.id">
						{{ task.title }}
					</div>
				</draggable>
			</div>
  
			<!-- Colonne 2 : Critères d'acceptation -->
			<div class="bg-gray-100 p-4 rounded-lg">
				<h2 class="text-lg font-semibold mb-2">Critères d'acceptation</h2>
  
				<draggable  v-if="storiesProp.length>0" v-model="storiesProp">
					<div v-for="task in storiesProp" :key="task.id">
						{{ task.title }}
						<div v-for="(critere, index) in task.criteres" :key="index">
							{{ critere }}
						</div>
					</div>
				</draggable>
			</div>

			<!-- Colonne 3 : TODO -->
			<div class="bg-gray-100 p-4 rounded-lg">
				<h2 class="text-lg font-semibold mb-2">TODO</h2>
				<draggable v-if="todoProp.length>0" v-model="todoProp">
					<div v-for="task in todoProp" :key="task.id">
						{{ task.title }}
					</div>
				</draggable>
			</div>

			<!-- Colonne 4 : En cours -->
			<div class="bg-gray-100 p-4 rounded-lg">
				<h2 class="text-lg font-semibold mb-2">En cours</h2>
				<draggable  v-if="inprogressProp.length>0" v-model="inprogressProp">
					<div v-for="task in inprogressProp" :key="task.id">
						{{ task.title }}
					</div>
				</draggable>
			</div>

			<!-- Colonne 5 : Terminé -->
			<div class="bg-gray-100 p-4 rounded-lg">
				<h2 class="text-lg font-semibold mb-2">Terminé</h2>
				<draggable  v-if="doneProp.length>0" v-model="doneProp">
					<div v-for="task in doneProp" :key="task.id">
						{{ task.title }}
					</div>
				</draggable>
			</div>

			<!-- Colonne 6 : DOD -->
			<div class="bg-gray-100 p-4 rounded-lg">
				<h2 class="text-lg font-semibold mb-2">DOD</h2>
				<div class="p-2">
					<div v-for="(dod, index) in dodList" :key="index" class="bg-white rounded-md p-2 mb-2">
						<div class="flex justify-between">
							<div class="text-lg font-semibold">{{ dod.title }}</div>
							<div class="cursor-pointer" @click="removeDod(index)">
								<svg class="w-4 h-4 fill-current text-gray-400 hover:text-gray-600" viewBox="0 0 20 20">
									<path
									d="M10 0c-5.522847 0-10 4.477153-10 10s4.477153 10 10 10 10-4.477153 10-10-4.477153-10-10-10zm3.535534 13.535534c.390525.390524.390525 1.023689 0 1.414213-.195262.195262-.451185.292893-.707107.292893-.255922 0-.511845-.097631-.707107-.292893l-2.828427-2.828427-2.828427 2.828427c-.195262.195262-.451185.292893-.707107.292893-.255922 0-.511845-.097631-.707107-.292893-.390524-.390524-.390524-1.023689 0-1.414213l2.828427-2.828427-2.828427-2.828427c-.390524-.390524-.390524-1.023689 0-1.414213.390524-.390524 1.023689-.390524 1.414213 0l2.828427 2.828427 2.828427-2.828427c.390524-.390524 1.023689-.390524 1.414213 0 .390524.390524.390524 1.023689 0 1.414213l-2.828427 2.828427 2.828427 2.828427z" />
								</svg>
							</div>
						</div>
						<div class="text-gray-600">{{ dod.description }}</div>
					</div>
					<div class="flex justify-center">
						<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
							@click="showDodForm = true">Ajouter DOD</button>
					</div>
				</div>

				<div v-if="showDodForm" class="fixed z-50 inset-0 overflow-y-auto">
					<div class="flex items-center justify-center min-h-screen">
						<div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
							<h2 class="text-lg font-semibold mb-2">Ajouter une nouvelle DOD</h2>
							<div class="mb-4">
								<label class="block"></label>
								<input class="border rounded-md w-full py-2 px-3" type="text" v-model="newDod.title" placeholder="Titre" />
							</div>
							<div class="mb-4">
								<label class="block"></label>
								<textarea class="border rounded-md w-full py-2 px-3" v-model="newDod.description"
									placeholder="Description"></textarea>
							</div>
							<div class="flex justify-end">
								<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
									@click="addDod">Ajouter</button>
								<button class="bg-white hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-full"
									@click="showDodForm = false">Annuler</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Colonne 7 : DOF -->
			<div class="bg-gray-100 p-4 rounded-lg">
				<h2 class="text-lg font-semibold mb-2">DOF</h2>
				<div class="p-2">
					<div v-for="(dof, index) in dofList" :key="index" class="bg-white rounded-md p-2 mb-2">
						<div class="flex justify-between">
							<div class="text-lg font-semibold">{{ dof.title }}</div>
							<div class="cursor-pointer" @click="removeDof(index)">
								<svg class="w-4 h-4 fill-current text-gray-400 hover:text-gray-600" viewBox="0 0 20 20">
									<path
									d="M10 0c-5.522847 0-10 4.477153-10 10s4.477153 10 10 10 10-4.477153 10-10-4.477153-10-10-10zm3.535534 13.535534c.390525.390524.390525 1.023689 0 1.414213-.195262.195262-.451185.292893-.707107.292893-.255922 0-.511845-.097631-.707107-.292893l-2.828427-2.828427-2.828427 2.828427c-.195262.195262-.451185.292893-.707107.292893-.255922 0-.511845-.097631-.707107-.292893-.390524-.390524-.390524-1.023689 0-1.414213l2.828427-2.828427-2.828427-2.828427c-.390524-.390524-.390524-1.023689 0-1.414213.390524-.390524 1.023689-.390524 1.414213 0l2.828427 2.828427 2.828427-2.828427c.390524-.390524 1.023689-.390524 1.414213 0 .390524.390524.390524 1.023689 0 1.414213l-2.828427 2.828427 2.828427 2.828427z" />
								</svg>
							</div>
						</div>
						<div class="text-gray-600">{{ dof.description }}</div>
					</div>
					<div class="flex justify-center">
						<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="addDof">
							Add DOF
						</button>
					</div>
				</div>
			</div>
			<p class="mt-8"><strong>DOD:</strong> Definition of Done - ce qui doit être rempli pour qu'une user story soit
			considérée comme terminée.</p>
			<p><strong>DOF:</strong> Definition of Fun - les éléments de qualité qui sont importants pour les utilisateurs et
			qui rendent l'application agréable à utiliser.</p>
		</div>
	</div>
</template>
	
<script setup lang="ts">
import { ref, reactive } from 'vue'
import draggable from 'vuedraggable';

const props = defineProps<{
	semaine: number,
	stories: Array<any>,
	todo: Array<any>,
	inProgres: Array<any>,
	done: Array<any>,
}>()

const semaineProp = ref(props.semaine);
const storiesProp = ref(props.stories);
const todoProp = ref(props.todo);
const inprogressProp = ref(props.inProgres);
const doneProp = ref(props.done);


const dodList = ref([]);
const showDodForm = ref(false);

const dofList = ref([]);


const newDod = reactive({
	title: "",
	description: ""
})

const addDod = () => {
	//a definir
}

const addDof = () => {
	//a definir
}

const removeDod = (index: number) => {
	//a definir
}

const removeDof = (index: number) => {
	//a definir
}
</script>

<style scoped>/* Styles pour le board EduScrum */
.dragging {
opacity: 0.5;
border: 2px dashed gray;
}
</style>