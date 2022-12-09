<template>
    <div class="flex flex-col items-center justify-center container">

        <div class="m-10">
            <div class="flex flex-col items-center justify-center">
                <h1 class="text-5xl font-bold text-white">Cours</h1>
            </div>
        </div>        
        
        <div class="flex flex-row items-center justify-center m-10">
            <div>
                <p>Année {{ StartYears }} - {{ EndYears }}</p>
            </div>
        </div>
        
        <div>
            <div class="flex flex-row items-center justify-center">
                <input type="text" v-model="serach" placeholder="Rechercher un cours" class="border-2 border-black m-4 inline-block p-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent w-full">
            </div>
            <div>
                <div>
                    <div v-for="course in filteredCourses" :key="course.id" class="flex flex-col items-center justify-center max-w-2xl mb-6 ">
                        <div class="flex flex-row p-6 border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <p class="mb-2 m-2 text-gray-900 dark:text-white flex items-center justify-center"
                            >{{ course.name }}</p>
                            <p class=" m-2 text-gray-700 dark:text-gray-400">{{ course.description }}</p>
                            <div class="flex flex-row items-center justify-center" >
                                <button href="www.google.fr" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Voir le cours
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-if="filteredCourses.length === 0">
                        <p>Aucun cours trouvé</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const courses = ref([
    {
        id: 1,
        name: 'Cours 1',
        description: 'cours 1 description'
    },
    {
        id: 2,
        name: 'Cours 2',
        description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel tincidunt luctus, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet lorem. Sed euismod, nisl vel tincidunt luctus, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet lorem.'
    },
    {
        id: 3,
        name: 'Cours 3',
        description: 'cours 3 description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel tincidunt luctus, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet lorem. Sed euismod, nisl vel tincidunt luctus, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet lorem.'
    },
    {
        id: 4,
        name: 'Cours 4',
        description: 'cours 4 description lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel tincidunt luctus, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet lorem. Sed euismod, nisl vel tincidunt luctus, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet lorem. Sed euismod, nisl vel tincidunt luctus, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet lorem. Sed euismod, nisl vel tincidunt luctus, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet lorem.'
    },
    {
        id: 5,
        name: 'Cours 5',
        description: 'cours 5 description'
    },
    {
        id: 6,
        name: 'Cours 6',
        description: 'cours 6 description'
    },
    {
        id: 7,
        name: 'Cours 7',
        description: 'cours 7 description'
    },
    {
        id: 8,
        name: 'Cours 8',
        description: 'cours 8 description'
    },
    {
        id: 9,
        name: 'Cours 9',
        description: 'cours 9 description'
    },
    {
        id: 10,
        name: 'Cours 10',
        description: 'cours 10 description'
    },
    {
        id: 11,
        name: 'Cours 11',
        description: 'cours 11 description'
    },
    {
        id: 12,
        name: 'Cours 12',
        description: 'cours 12 description'
    },
    {
        id: 13,
        name: 'Cours 13',
        description: 'cours 13 description'
    },
    {
        id: 14,
        name: 'Cours 14',
        description: 'cours 14 description'
    },
    {
        id: 15,
        name: 'Cours 15',
        description: 'cours 15 description'
    },
    {
        id: 16,
        name: 'Cours 16',
        description: 'cours 16 description'
    },
    {
        id: 17,
        name: 'Cours 17',
        description: 'cours 17 description'
    },
    {
        id: 18,
        name: 'Cours 18',
        description: 'cours 18 description'
    },
    {
        id: 19,
        name: 'Cours 19',
        description: 'cours 19 description'
    },
    {
        id: 20,
        name: 'Cours 20',
        description: 'cours 20 description'
    },
]);
const StartYears = ref(2021);
const EndYears = ref(2022);

const serach = ref('');

const filteredCourses = computed(() => {
    return courses.value.filter((course) => {
        return course.name.toLowerCase().includes(serach.value.toLowerCase());
    });
});

</script>