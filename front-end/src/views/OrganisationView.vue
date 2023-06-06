<template>
    <div class="mx-auto p-4 rounded-lg bg-light-primary dark:bg-dark-secondary text-left mt-10 ml-12 mr-12 w-11/12">
        <div v-show="this.showProject == ''">
            <h1 class="text-6xl font-bold dark:text-dark-font">Organisation</h1>
            <div class="actualSprint marg">Sprint sélectionné:<br/>
                <select id="select" @change="setCourseId($event)">
                    <option>Sélectionnez un Sprint</option>
                    <option v-for="course in courses"  :value=course._id>{{ course.tag }}</option>
                </select>
            </div>
            <div class="w-full h-fit flex flex-col gap-3 rounded-lg bg-light-primary dark:bg-dark-tertiary py-2 px-4 justify-start items-start" v-if="courseId != ''">
                <h2 class="text-2xl font-bold dark:text-dark-font">Backlog de la semaine</h2>
                <div class="backlog">
                    <div class="iconeGroupe">
                        <span style="font-size:20px;" >En tant que<br/></span>
                        <span style="font-size:20px;" >Je veux<br/></span>
                        <span style="font-size:20px;" >Afin de<br/></span>
                        <span style="font-size:20px;" >Critères d'acceptation:<br/></span>
                        <span style="font-size:20px;" >Valeur:<br/></span>
                        <div style="position:absolute;right:10px;bottom:10px;">
                            <button><img class="icon" src="https://cdn-icons-png.flaticon.com/512/2089/2089792.png" alt="orga_1"></button>
                            <button style="background-color:red;"><img class="icon" src="https://cdn-icons-png.flaticon.com/512/542/542724.png" alt="orga_2"></button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full h-fit flex flex-col gap-3 rounded-lg bg-light-primary dark:bg-dark-tertiary py-2 px-4 justify-start items-start" v-if="courseId != ''">
                <h2 class="text-2xl font-bold dark:text-dark-font">Plannings de ce sprint</h2>
                <div class="groups">
                    <div class="iconeGroupe" v-for="group in groups">
                        <span style="font-size:20px;" v-for="student in group">{{ student }}<br/></span>
                        <div style="position:absolute;left:10px;bottom:10px;">
                            <button @click="openProject(group)" class="rounded-lg hover:bg-stone-300">Ouvrir le projet</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="showProject" class="ml-12">
            <div>
                <p class="text-3xl font-bold dark:text-[#9ca3af] text-[#213547]"></p>
                <p class="text-lg font-medium dark:text-[#9ca3af] text-[#213547]"></p>
            </div>
            <div class="w-full justify-center h-fit rounded-lg bg-light-primary dark:bg-dark-tertiary py-4 px-4" v-if="courseId != ''">
                <h1 class="dark:text-[#9ca3af] text-[#213547]">Membres</h1>
            <div class="flex flex-row flex-wrap gap-3 mt-4">
                <div class="bg-[#5C5F73] rounded-lg px-4 py-2" v-for="student in selectedGroup" :key="student">
                    <p class="text-2xl text-[#9ca3af]">{{ student }}</p>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';

let courseId = '';
let courses = [];
let studentList = [];
let groups = [];
let showProject = '';
let selectedGroup = []

export default {

    name: 'OrganisationView',
    default: () => [],
	data() {
		return {
            courses,
            courseId,
			groups,
			studentList,
			isPO: false,
            showProject, 
            selectedGroup,
		};
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
                this.groups.forEach(group => { //Pour chaque groupe
                    group.forEach(student => { //Pour chaque élève du groupe
                        this.studentList.forEach(user => { //On compare avec tous les élèves
                            if(student == user._id) {
                                group[group.indexOf(student)] = (user.profile.firstName +' '+ user.profile.lastName);
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
        }
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