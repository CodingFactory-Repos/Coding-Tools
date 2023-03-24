<template>
    <div class="modal">
        <div class="modal-overlay" @click="$emit('close')"></div>
        <div class="modal-container">
            <h3 class="text-xl pb-2 font-medium leading-6 text-gray-900 flex justify-center mb-3">Ajouter un cours</h3>
            <div class="modal-body">
                <form class="w-full max-w-sm" @submit.prevent="AddCourses">
                    <div v-for="(label, index) in fields" :key="index" class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" :for="label.id">{{ label.name }}</label>
                        <input :class="label.classes" :type="label.type" :placeholder="label.placeholder" v-model="label.value">
                    </div>
                    <div class="flex justify-center mt-6">
                        <button
                            class="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            type="button" @click="$emit('close')">Fermer</button>
                        <button
                            class="ml-4 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            type="submit" @click="AddCourses">Ajouter</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">

export default {
    name: 'AddCourses',
    data() {
        return {
            fields: [
                {
                    id: 'tag',
                    name: 'Tag',
                    classes: 'w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
                    placeholder: 'Nom du cours',
                    value: '',
                    type: 'text'
                },
                {
                    id: 'ProductOwner',
                    name: 'Product Owner',
                    classes: 'w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
                    placeholder: 'Description du cours',
                    value: '',
                    type: 'text'
                },
                {
                    id: 'periodStart',
                    name: 'Date de début',
                    classes: 'w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
                    placeholder: 'Date de début du cours',
                    value: '',
                    type: 'date'
                },
                {
                    id: 'periodEnd',
                    name: 'Date de fin',
                    classes: 'w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
                    placeholder: 'Date de fin du cours',
                    value: '',
                    type: 'date'
                },
                {
                    id: 'Picture',
                    name: 'Image',
                    classes: 'w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
                    placeholder: 'Image du cours',
                    value: '',
                    type: 'text'
                },

            ]
        }
    },
    methods: {
        AddCourses(){
            console.log(this.fields)

        }
    }
}
</script>

<style>
.modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid black;
    padding: 20px;
    z-index: 1000;
    border-radius: 0.375rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

}
</style>