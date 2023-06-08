<template>
    <div v-show="showProject">
        <button @click="this.showProject = false" class="back-button fixed pl-1.5 w-[2.5em] h-[2.5em] top-4 left-36 rounded-lg bg-light-primary dark:bg-dark-tertiary">
            <svg class="fill:dark-primary" xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg> 
        </button>
        <h1 class="font-bold dark:text-[#9ca3af] text-[#213547] ml-32 mt-3">Planning</h1> 
    </div>
    <div class="mx-auto p-4 rounded-lg bg-light-primary dark:bg-dark-secondary text-left mt-10 ml-12 mr-12 w-11/12">
        <div v-show="this.showProject == false">
            <h1 class="text-6xl font-bold dark:text-dark-font text-gray-800">Organisation</h1>
            <div class="mt-4 actualSprint block w-96 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-light-secondary dark:bg-dark-tertiary focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">Sprint sélectionné:<br/>
                <select id="select" @change="setCourseId($event)" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                    <option>Sélectionnez un Sprint</option>
                    <option v-for="course in courses"  :value=course._id>{{ course.tag }}</option>
                </select>
            </div>
            <div class="rounded-lg mt-4 w-full h-fit flex flex-col gap-3 bg-light-secondary dark:bg-dark-tertiary py-2 px-4 justify-start items-start" v-if="courseId != ''">
                <div class="inline-block">
                    <button @click="this.backlogForm=true;" class="back-button pl-[0.425rem] w-[2.5em] h-[2.5em] rounded-lg bg-light-primary dark:bg-dark-highlight">
                        <svg class="button" xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 576 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z"/></svg>
                    </button>
                    <span class="ml-2 text-3xl font-bold dark:text-dark-font text-gray-800">Backlog de la semaine</span>

                </div>
                <div v-if="this.backlog.length==0" class="text-1xl font-bold dark:text-dark-font text-gray-800 m-0">
                    <p>Vous n'avez pas de backlog de défini. Voulez-vous uploader un fichier PDF?</p>
                </div>
                <div v-else class="flex flex-wrap">
                    <div class="backlog" v-if="courseId != ''" v-for="story in this.backlog">
                        <BacklogItem @deleteStory="deleteStory" :as="story.as" :iWant="story.iWant" :soThat="story.soThat" :acceptationCriteria="story.acceptationCriteria" :valeur="story.value" :_id="story._id"/>
                    </div>
                </div>
            </div>
            <div class="w-full mt-4 h-fit flex flex-col gap-3 rounded-lg bg-light-secondary dark:bg-dark-tertiary py-2 px-4 justify-start items-start" v-if="courseId != ''">
                <h2 class="text-2xl font-bold dark:text-dark-font">Groupes d'élèves de ce sprint</h2>
                <div class="groups">
                    <div class="iconeGroupe !bg-white dark:!bg-dark-highlight" v-for="groupe in groups">
                        <span style="font-size:20px;" class="dark:text-white text-[#213547]" v-for="student in groupe.group">{{ student }}<br/></span>
                        <div style="position:absolute;left:10px;bottom:10px;">
                            <button @click="openProject(groupe.group)" class="text-white font-bold rounded-lg text-sm px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant">Ouvrir le projet</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="showProject" class="">
            <div class="static">
                <p class="text-3xl font-bold dark:text-[#9ca3af] text-[#213547]">Groupe 1</p>                
                <p class="text-lg font-medium dark:text-[#9ca3af] text-[#213547]">{{ selectedCourse }}</p>
                <button class="absolute -mt-12 right-10 md:right-14 lg:right-20 text-white p-2 rounded-lg hover:bg-light-secondary dark:hover:bg-dark-tertiary gradiant bg-[#24292E] hover:bg-[#24292E99] shadow">
                    Nouveau board
            </button>
            </div>
            <div class="flex">
            <div class="w-full h-fit justify-center rounded-lg bg-light-tertiary dark:bg-dark-tertiary py-4 px-4" v-if="courseId != ''">
                <h1 class="dark:text-[#9ca3af] text-[#213547]">Membres</h1>
            <div class="flex flex-row flex-wrap gap-3 mt-4">
                <div class="bg-[#5C5F73] rounded-lg px-4 py-2" v-for="student in selectedGroup" :key="student">
                    <p class="text-2xl text-white">{{ student }}</p>
                </div>
            </div>
            </div>
            <button class="p-2 button-add-members hover:bg-light-secondary dark:hover:bg-dark-tertiary gradiant relative right-4 bg-[#24292E] hover:bg-[#24292E99] shadow">
                <svg class="fill-white" xmlns="http://www.w3.org/2000/svg" height="1.5em" width="1.5em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
            </button>
            </div>
        </div>
        <Modal v-if="backlogForm==true" @close="backlogForm = false">
            <template #body>
                <StoriesForm  :courseId="this.courseId" @close="backlogForm = false; this.getBacklog();"/>
            </template>
        </Modal>
    </div>
</template>

<script lang="ts">
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';
import ButtonIcon from '@/components/common/buttons/Icon.vue';
import SvgEdit from '@/components/common/svg/Edit.vue';
import StoriesForm from '@/components/scrum/StoriesForm.vue';
import Modal from '@/components/common/Modal.vue';
import BacklogItem from '@/components/scrum/BacklogItem.vue';

let courseId = '';
let courses = [];
let studentList = [];
let groups = [];
let groups2 = [];
let showProject = '';
let selectedGroup = []
let selectedIDs = [];
let selectedCourse = ''
let backlog = [];

export default {

    name: 'OrganisationView',
    default: () => [],
	data() {
		return {
            courses,
            courseId,
            groups,
            groups2,
			studentList,
			isPO: false,
            showProject, 
            selectedGroup,
            selectedCourse,
            selectedIDs,
            backlog,
            backlogForm: false,
		};
	},
    components: {
        ButtonIcon,
        SvgEdit,
        StoriesForm,
        Modal,
        BacklogItem
    },

	mounted() {
		this.getCourses();
	},
	methods: {
		getCourses: withErrorHandler(async function () {
			http.get(`/courses`).then((response) => {
				this.courses = [...response.data];
			});
		}),
        getStudentList: withErrorHandler(async function () {
			http.get(`/calls/student_list/${this.courseId}`).then((response) => {
				this.studentList = response.data.studentList;
                this.groups.forEach(groupe => { //Pour chaque groupe
                    groupe.group.forEach(student => { //Pour chaque élève du groupe
                        this.studentList.forEach(user => { //On compare avec tous les élèves
                            if(student == user._id) {
                                groupe.group[groupe.group.indexOf(student)] = (user.profile.firstName +' '+ user.profile.lastName);
                            }
                        }); 
                    });
                });
			});
        }),

        openProject(group) {
            this.showProject = true;
            this.selectedGroup = [...group];
            this.selectedIDs = this.groups2[this.groups.indexOf(group)];
            console.log('G1: ',this.selectedGroup);
            console.log('G2: ',this.selectedIDs);
        },
        getBacklog: withErrorHandler(async function () {
            http.get(`/stories/course/${this.courseId}`).then((response) => {
                this.backlog = response.data;
            });
        }),
        setCourseId(event) {
            let course;
            this.courses.forEach(courseElt => {
                if(courseElt._id == event.target.value) {
                    console.log('Course: ',courseElt);
                    course = courseElt;
                }
            });

            this.selectedCourse = course.tag;
            this.courseId = course._id;
            this.groups = JSON.parse(JSON.stringify(course.groups));
            this.groups2 = JSON.parse(JSON.stringify(course.groups));
            this.getStudentList();
            this.getBacklog();
        },
        deleteStory(id) {
            http.delete(`/stories/delete/${id}`).then((response) => {
                this.getBacklog();
            });
        },
	},
};
</script>

<style>
.groups {
    display: flex;
    flex-wrap: wrap;
}
.iconeGroupe {
    min-width: 260px;
    width: 20%;
    height: 200px;
    position: relative;
    background-color: #f0f0f0;
    border-radius: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 10px;
}
.content {
    width:100%;
    padding: 20px;
    margin-bottom: auto;
}
.marg {
    margin: 10px;
}
.actualSprint {
    width: fit-content;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 10px;
    font-size: 20px;
}
.link {
    font-size: 15px;
    border-radius: 5px;
    padding: 5px;
    background-color: #bfbfbf;
    color: black;
}
.relative {
    position: relative;
}
button {
    background-color: #bfbfbf;
    padding: 5px;
    font-size: 15px;
}
.icon {
    width: 20px;
    height: 20px;
}

.back-button {
    fill:#9CA3AF;
}

.back-button:hover {
    fill:#FFF;
}

.button-add-members {
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}
</style>