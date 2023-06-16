<template>
    <div v-show="showProject">
        <button @click="this.showProject = false; this.showMain = true;" class="back-button fixed pl-1.5 w-[2.5em] h-[2.5em] top-4 left-36 rounded-lg bg-light-primary dark:bg-dark-tertiary">
            <svg class="fill-[#9CA3AF] dark:hover:fill-white hover:fill-[#5C5F73]" xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg> 
        </button>
        <h1 class="font-bold dark:text-[#9ca3af] text-[#213547] ml-32 mt-3">Groupe de projet</h1> 
    </div>
    <div class="mx-auto p-4 rounded-lg bg-light-primary dark:bg-dark-secondary text-left mt-10 ml-12 mr-12 w-11/12">
        <div v-show="this.showMain">
            <div class="relative rounded-lg mt-4 w-full h-fit flex flex-col gap-3 bg-light-secondary dark:bg-dark-tertiary py-2 px-4 justify-start items-start">
                <h1 class="absolute top-px right-px m-4 text-6xl font-bold dark:text-dark-font text-gray-800">Organisation Scrum</h1>
                <div v-if="this.courseId == ''" class="noClasses text-1xl align-center font-bold dark:text-dark-font text-gray-800 m-0">
                    <p >Vous n'avez pas de cours cette semaine.</p>
                </div>
                <div v-else>
                    <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 h-fit flex flex-col gap-3 rounded-lg bg-light-secondary dark:bg-dark-tertiary py-2 px-4 justify-start items-start">
                        <h2 class="text-2xl font-bold dark:text-dark-font">Cours actuel</h2>
                        <div class="flex flex-row flex-wrap gap-3">
                            <div class="bg-[#5C5F73] rounded-lg px-4 py-2">
                                <p class="text-2xl text-white">{{ selectedCourse }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 h-fit flex flex-col gap-3 rounded-lg bg-light-secondary dark:bg-dark-tertiary py-2 px-4 justify-start items-start">
                        <h2 class="text-2xl font-bold dark:text-dark-font">Votre équipe</h2>
                        <div class="flex flex-row w-full flex-wrap gap-3">
                            <div class="bg-[#5C5F73] rounded-lg px-4 py-2 flex flex-col" v-for="studentId in selectedGroup">
                                <p class="text-2xl text-white">{{ studentId }}</p>
                            </div>
                        </div>
                    </div>
                    <h2 class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 h-fit text-2xl py-2 px-4 justify-start items-start font-bold dark:text-dark-font">Backlog</h2>
                    <div v-if="this.backlog.length==0" class="text-1xl font-bold dark:text-dark-font text-gray-800 m-0">
                        <p>Ce cours n'a pas encore de backlog de défini.</p>
                    </div>
                    <div v-else class="flex flex-wrap px-4">
                        <div class="backlog" v-if="courseId != ''" v-for="story in this.backlog">
                            <BacklogItem @deleteStory="deleteStory" :options="false" :as="story.as" :iWant="story.iWant" :soThat="story.soThat" :acceptationCriteria="story.acceptationCriteria" :valeur="story.value" :_id="story._id"/>
                        </div>
                    </div>
                    <button @click="openProject()" class="text-white font-bold rounded-lg text-sm mx-4 my-2 px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant">Ouvrir le planning du projet</button>
                </div>
            </div>
            <div class="w-full mt-4 h-fit flex flex-col gap-3 rounded-lg bg-light-secondary dark:bg-dark-tertiary py-2 px-4 justify-start items-start" v-if="courseId != ''">
                <div class="flex justify-between w-full">
                    <h2 class="text-4xl font-bold dark:text-dark-font">Vos projets</h2>
                    <button @click="this.createProject=true; this.editProjectForm=true;" class="p-2 rounded-lg hover:bg-light-secondary dark:hover:bg-dark-tertiary gradiant bg-[#24292E] hover:bg-[#24292E99] shadow">
                        <svg class="fill-white" xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 576 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z"/></svg>
                    </button>
                </div>
                <div class="groups">
                    <div class="iconeGroupe !bg-white dark:!bg-dark-highlight" v-for="projet in projects">
                        <div>{{ projet.title }}</div>
                        <button @click="openProject(projet)" class="text-white font-bold rounded-lg text-sm mx-4 my-2 px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant">Ouvrir le planning du projet</button>

                    </div>
                </div>
            </div>
        </div>
        <div v-show="showProject" class="">
            <div class="static">
                <p class="text-3xl font-bold dark:text-[#9ca3af] text-[#213547]">{{ projectTitle }}</p>                
                <p v-if="this.projectCreator == ''" class="text-lg font-medium dark:text-[#9ca3af] text-[#213547]">{{ selectedCourse }}</p>
                <div class="inline-flex absolute right-10 md:right-14 lg:right-20 -mt-12 space-x-4">
                <button @click="this.createProject=false; this.editProjectForm=true;" class="p-2 rounded-lg hover:bg-light-secondary dark:hover:bg-dark-tertiary gradiant bg-[#24292E] hover:bg-[#24292E99] shadow">
                    <svg class="fill-white" xmlns="http://www.w3.org/2000/svg" height="1.6em" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>
                </button>
                <button @click="this.boardForm=true;" class="text-white p-2 rounded-lg hover:bg-light-secondary dark:hover:bg-dark-tertiary gradiant bg-[#24292E] hover:bg-[#24292E99] shadow">
                    Nouveau board
                </button>
                </div>
            </div>
            <div class="flex">
            <div class="w-full h-fit justify-center rounded-lg bg-light-tertiary dark:bg-dark-tertiary py-4 px-4" v-if="courseId != ''">
                <h1 class="dark:text-[#9ca3af] text-[#213547]">Membres</h1>
            <div class="flex flex-row flex-wrap gap-3 mt-4">
                <div class="bg-[#5C5F73] rounded-lg px-4 py-2" v-for="student in projectGroup" :key="student">
                    <p class="text-2xl text-white">{{ student }}</p>
                </div>
            </div>
            </div>
            <button v-if="this.projectCreator != '' && this.projectGroup.length < 5" @click="this.addMemberForm=true;" class="p-2 button-add-members hover:bg-light-secondary dark:hover:bg-dark-tertiary gradiant relative right-4 bg-[#24292E] hover:bg-[#24292E99] shadow">
                <svg class="fill-white" xmlns="http://www.w3.org/2000/svg" height="1.5em" width="1.5em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
            </button>
            </div>
            <div class="flex flex-column w-full my-4">
                <div v-for="board in boards" class="iconeGroupe !bg-white dark:!bg-dark-highlight">
                    <span style="font-size:20px;" class="dark:text-white text-[#213547]">{{ board.title }}<br/></span>
                    <div style="position:absolute;left:10px;bottom:10px;">
                    <button @click="openBoard(board.title, board._id)" class="text-white font-bold rounded-lg text-sm px-4 py-2 focus:outline-none flex justify-center items-center gap-2 gradiant">Ouvrir la board</button>
                    </div>
                    <div class="text-gray-800 rounded-lg mr-1" style="position:absolute;right:10px;bottom:10px;">
                        <button class="bg-red-700 rounded-lg p-2"><img class="icon" src="https://cdn-icons-png.flaticon.com/512/542/542724.png" @click="this.deleteBoard(board._id)"></button>
                    </div>
                </div>
            </div>
        </div>
        <ScrumBoard v-if="showBoard" :title="boardTitle" :boardId="boardId" :projectId="projectId" :selectedGroupNames="selectedGroup" :selectedGroupIDs="selectedIDs" :courseTag="actualCourse.tag" @closeBoard="closeBoard"/>
        <Modal v-if="backlogForm==true" @close="backlogForm = false">
            <template #body>
                <StoriesForm  :courseId="this.courseId" @close="backlogForm = false; this.getBacklog();"/>
            </template>
        </Modal>
        <Modal v-if="boardForm==true" @close="boardForm = false">
            <template #body>
                <BoardForm  :projectId="this.projectId" @close="boardForm = false; this.getBoards();"/>
            </template>
        </Modal>
        <Modal v-if="editProjectForm" @close="editProjectForm = false">
            <template #body>
                <EditProjectForm  @close="editProjectForm = false; getAllProjectsOfUser();" :createProject="this.createProject"  :creatorId="this.user._id" :projectId="this.projectId" :initialTitle="this.projectTitle" :initialDescription="this.projectDescription" @doesProjectExist="doesProjectExist" />
            </template>
        </Modal>
        <Modal v-if="addMemberForm" @close="addMemberForm = false">
            <template #body>
                <AddMemberForm  @close="pushInProjectGroup" :projectId="this.projectId" :initialTitle="this.projectTitle" :initialDescription="this.projectDescription" :studentList="studentList" @doesProjectExist="doesProjectExist" />
            </template>
        </Modal>
    </div>
</template>

<script>
import { http } from '@/api/network/axios';
import { withErrorHandler } from '@/utils/storeHandler';
import ButtonIcon from '@/components/common/buttons/Icon.vue';
import SvgEdit from '@/components/common/svg/Edit.vue';
import StoriesForm from '@/components/scrum/StoriesForm.vue';
import BoardForm from '@/components/scrum/BoardForm.vue';
import Modal from '@/components/common/Modal.vue';
import { computed, ref } from 'vue';
import BacklogItem from '@/components/scrum/BacklogItem.vue';
import EditProjectForm from '@/components/scrum/EditProjectForm.vue';
import AddMemberForm from '@/components/scrum/AddMemberForm.vue';
import ScrumBoard from '@/components/scrum/ScrumBoard.vue';
import { useAuthStore } from '@/store/modules/auth.store';

let courseId = '';
let projects = [];
let courses = [];
let actualCourse = [];
let studentList = [];
let groups = [];
let groups2 = [];
let showProject = '';
let selectedGroup = []
let selectedIDs = [];
let selectedCourse = ''
let backlog = [];
let boards = [];
let title = ''
let description = ''
let group = []
let projectTitle = ''
let createProject = false
let projectGroup = []
let projectGroupNames = []
let projectCreator = ''
let courseProject = []

let boardTitle = ''
let boardId = ''
let projectId = ''

export default {
    data() {
        return {
            courses,
            projects,
            actualCourse,
            courseId,
            groups,
            groups2,
            studentList,
            showProject, 
            selectedGroup,//Noms des élèves du groupe de cours
            selectedCourse,
            selectedIDs,//IDs des élèves...
            backlog,
            title,
            description,
            group,
            projectTitle,
            boards,
            createProject,
            courseProject,

            projectGroup,//Noms des élèves du groupe du projet cliqué
            projectGroupNames,//IDs des élèves du groupe du projet cliqué
            projectCreator,

            boardTitle,
            boardId,
            projectId,

            showMain: true,
            backlogForm: false,
            boardForm: false,
            editProjectForm: false,
            addMemberForm: false,
            showBoard: false,

            showStudentsInGroups: false,
        };
    },
    mounted() {
        this.getActualCourse(); 
        //1: On récupère le cours actual
        //2: On récupère les groupes de ce cours
        //3: On récupère les élèves de ce cours
    },
    setup() {
        const authStore = useAuthStore();
        const user = computed(() => authStore.user);
        return { user };
    },
  components: {
    ButtonIcon,
    SvgEdit,
    StoriesForm,
    Modal,
    BacklogItem,
    BoardForm,
    EditProjectForm,
    AddMemberForm,
    ScrumBoard,
  },
  methods: {
    getActualCourse: withErrorHandler(async function () {
        http.get(`/calls/actual_course`).then((response) => {
            this.courseId = response.data.actualCourse;
            http.get('/courses/'+response.data.actualCourse).then((response) => {
                this.actualCourse = response.data.courseById.course;
                this.setCourseId();
            })
            console.log('Actual course: ',this.actualCourse);
            this.getAllProjectsOfUser();
        });
    }),
    openProject(projet = this.courseProject) {
        this.showProject = true;
        this.showMain = false;

        if(projet != []){
            this.projectTitle = projet.title;
        this.projectDescription = projet.description;
        this.projectId = projet._id??this.projectId;
        this.projectGroup = projet.group??this.projectGroup;
        this.projectCreator = projet.creator??'';
        }

        console.log('Selected group Name : ',this.selectedGroup);
        console.log('Selected group Ids: ', this.selectedIDs);

        console.log('courseeee: ', this.actualCourse);
        this.title = 'Projet ' + this.actualCourse.tag;          
        if(projet == this.projet){this.doesProjectExist(this.selectedIDs[0]);}
        else{    
            this.getStudentList();
            this.getBoards();
        }
    },
    setCourseId() {
        let course = this.actualCourse;

        this.selectedCourse = course.tag;
        this.courseId = course._id;
        if(course.groups != undefined) {
            course.groups.forEach(group => {
                group.group.forEach(student => {
                    if(student == this.user._id) {
                        this.selectedGroup = JSON.parse(JSON.stringify(group.group));;
                        this.selectedIDs = JSON.parse(JSON.stringify(group.group));
                    }
                });
            });
        }
        console.log('Group: ',this.selectedGroup);
        this.getStudentList();
        this.getBacklog();
    },
    getBacklog: withErrorHandler(async function () {
        http.get(`/stories/course/${this.courseId}`).then((response) => {
            this.backlog = response.data;
            console.log('This backlog: ', this.backlog);
        });
    }),
    doesProjectExist: withErrorHandler(async function (memberId = this.selectedIDs[0]) {
        console.log('memberId: '+ memberId);
        http.get(`/projects/exists/${this.courseId}/${memberId}`).then((response) => {
            console.log('createdproject:',response.data);
            if(response.data == null){//Si false (projet n'existe pas), on le crée
                this.createProject();
                console.log('project does not exist : ', this.project)
            }else{//Sinon, on l'ouvre
                this.project = response.data;
                if(this.courseProject==[]){this.courseProject = response.data;}
                console.log('project exist :', this.project);
                this.projectTitle = this.project.title;
                this.projectDescription = this.project.description;
                this.projectId = this.project._id;
            }
            console.log('Project title: ',this.project.title);
            this.getBoards();
        });
    }),
    getStudentList: withErrorHandler(async function () {
        http.get(`/calls/student_list/${this.courseId}`).then((response) => {
            this.studentList = response.data.studentList;
            console.log('Student list: ',this.studentList);

            this.selectedGroup.forEach(groupStudentId => { //Pour chaque groupe//Pour chaque élève du groupe
                this.studentList.forEach(user => { //On compare avec tous les élèves
                    if(groupStudentId == user._id) {
                        this.selectedGroup[this.selectedGroup.indexOf(groupStudentId)] = (user.profile.firstName +' '+ user.profile.lastName);
                    }
                }); 
            })
            if(this.projectGroup.length > 0){
                this.projectGroup.forEach(groupStudentId => { //Pour chaque groupe//Pour chaque élève du groupe
                this.studentList.forEach(user => { //On compare avec tous les élèves
                    if(groupStudentId == user._id) {
                        this.projectGroup[this.projectGroup.indexOf(groupStudentId)] = (user.profile.firstName +' '+ user.profile.lastName);
                    }
                }); 
            })
            }
            this.showStudentsInGroups = true;
            console.log('New selected group: ',this.selectedGroup);
        });
    }),
    getBoards: withErrorHandler(async function () {
        http.get(`/boards/project/${this.projectId}`).then((response) => {
            this.boards = response.data;
        });
        console.log('Boards: ',this.boards);
    }),
    createProject() {
        console.log("createProject");
        http.post('/projects/create', {
            title: this.title,
            group: this.selectedIDs,
            course: this.courseId,
            description: ''
        }).then((res) => {
            console.log(res);
            this.project = res.data;
        });
    },
    getAllProjectsOfUser() {
        http.get(`/projects/groupMember/${this.user._id}`).then((response) => {
            this.projects = response.data;
            response.data.forEach(element => {
                if(element.course == this.courseId){
                    this.courseProject = element;
                }
            });
            console.log('Course project: ',this.courseProject);
            console.log('Projects: ',this.projects);
        });
    },
    openBoard(boardTitle, boardId) {
        this.boardTitle = boardTitle;
        this.boardId = boardId;
        this.showBoard = true;
        this.showProject = false;
    },
    closeBoard() {
        this.showBoard = false;
        this.showProject = true;
    },
    deleteBoard(id) {
        http.delete(`/boards/delete/${id}`).then((response) => {
            this.getBoards();
        });
    },
    pushInProjectGroup(id) {
        this.addMemberForm = false; 
        this.projectGroup.push(id);
        this.projectGroupNames.push(id);
        console.log('Project group: ',this.projectGroup);
        this.getStudentList();
    },
  },
}

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
.noClasses{
    min-height: 88px;
}
</style>