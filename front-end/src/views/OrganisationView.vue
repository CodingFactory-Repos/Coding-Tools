<template>
    <div class="mx-auto p-4 rounded-lg bg-light-primary dark:bg-dark-secondary text-left mt-10 ml-12 mr-12 w-11/12">
        <div v-show="this.showProject == ''">
            <h1 class="text-6xl font-bold dark:text-dark-font text-gray-800">Organisation</h1>
            <div class="actualSprint marg block w-96 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">Sprint sélectionné:<br/>
                <select id="select" @change="setCourseId($event)" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                    <option>Sélectionnez un Sprint</option>
                    <option v-for="course in courses"  :value=course._id>{{ course.tag }}</option>
                </select>
            </div>
            <div class="rounded-lg w-full h-fit flex flex-col gap-3 bg-light-primary dark:bg-dark-tertiary py-2 px-4 justify-start items-start" v-if="courseId != ''">
                <div class="inline-block">
                    <ButtonIcon class="h-1/2" @click="this.backlogForm=true;">
                        <SvgEdit class="!fill-light-primary"/>
                    </ButtonIcon>
                    <span class="ml-2 text-3xl font-bold dark:text-dark-font text-gray-800">Backlog de la semaine</span>

                </div>
                <div v-if="this.backlog.length==0" class="text-1xl font-bold dark:text-dark-font text-gray-800">Vous n'avez pas de backlog de défini. Voulez-vous uploader un fichier PDF?</div>
                <div v-else class="flex flex-wrap">
                    <div class="backlog" v-if="courseId != ''" v-for="story in this.backlog">
                        <BacklogItem @deleteStory="deleteStory" :as="story.as" :iWant="story.iWant" :soThat="story.soThat" :acceptationCriteria="story.acceptationCriteria" :valeur="story.value" :_id="story._id"/>
                    </div>
                </div>
            </div>
            <div class="w-full h-fit flex flex-col gap-3 rounded-lg bg-light-primary dark:bg-dark-tertiary py-2 px-4 justify-start items-start" v-if="courseId != ''">
                <h2 class="text-2xl font-bold dark:text-dark-font">Groupes d'élèves de ce sprint</h2>
                <div class="groups">
                    <div class="iconeGroupe" v-for="groupe in groups">
                        <span class="text-gray-800" style="font-size:20px;" v-for="student in groupe.group">{{ student }}<br/></span>
                        <div style="position:absolute;left:10px;bottom:10px;">
                            <button @click="openProject(groupe.group)" class="rounded-lg hover:bg-stone-300">Ouvrir le projet</button>
                        </div>
                    </div>
                </div>
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
let showProject = '';
let selectedGroup = []
let backlog = [];

export default {

    name: 'OrganisationView',
    default: () => [],
	data() {
		return {
            courses,
            courseId,
			groups,
            backlog,
			studentList,
			isPO: false,
            showProject,
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
				this.courses = response.data;
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
            console.log(this.selectedGroup)
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
                    course = courseElt;
                }
            });

            this.courseId = course._id;
            this.groups = course.groups;
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
/** Don't add global style, thank you ! */
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
.icon {
    width: 20px;
    height: 20px;
}
</style>