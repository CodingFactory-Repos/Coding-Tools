<template>
    <div class="wrapper">
        <form @submit.prevent="addItem" autocomplete="off">
            <h1 class="dark-primary dark:text-dark-font">Suggestion de matériel</h1>
            <!-- to add new item into the list -->
            <div class="task">
                <input type="text" class="task-input" v-model="title" placeholder="Ajouter une suggestion" />
                <!-- Add item on click -->
                <button class="button btn-add text-black dark:text-dark-font font-bold" @click="openPopUp = true"
                    :disabled="title === ''">Ajouter</button>
            </div>

            <!-- Show added items in list view-->
            <ul class="task-list">
                <li class="task-list-item bg-light-tertiary dark:bg-dark-tertiary" v-for="item in items" @click="selectedItem=item.title">
                    <span class="text-black dark:text-dark-font">{{ item.title }}</span>
                    <!-- create devis on click-->
                    <button v-on:click="" class=" rounded-lg text-black dark:text-dark-font text-sm px-4 py-2 bg-light-tertiary dark:bg-dark-tertiary">Créer un devis</button>
                    <!-- delete item on click-->
                    <button @click="deleteItem(index)" class="button btn-delete text-black dark:text-dark-font"><svg
                            xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path
                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg></button>
                </li>
            </ul>
        </form>
    </div>
    <PopUp :title="title" @close="closePopup" @validation="getBdd" v-if="openPopUp" />
</template>
  
<script>
import { http } from "@/api/network/axios";
import PopUp from './common/PopUp.vue'

export default {
    data() {
        return {
            newItem: "", //item before adding into array
            openPopUp: false,
            title: "",
            items: []
        };
    },
    computed: {
        totalItems() {
            return this.items.length; //auto increment of 1 of each items added into array
        },
        isComplete() {
            return this.items.filter(item => item.completed).length; //to get completed [checkbox: checked] 
        }
    },
    methods: {
        addItem() {
            if (this.newItem !== "") {
                this.items.push({ text: this.newItem, completed: false }); //check if input field is empty, if not empty then push [input] into array [items] and mark not completed [checkbox: unchecked]
            }
        },
        deleteItem(index) {
            console.log(index)
            this.items.splice(index, 1); //remove item
        },
        closePopup() {
            this.openPopUp = false;
        },
        async getBdd() {
            const { title, price, desc, link, comments } = this
            const body = { title, price, desc, link, comments }
            const { data: items } = await http.get("/ideasequipments", body)
            this.items = items || []
        }
    },
    async created() {
        this.getBdd()
    },
    components: {
        PopUp
    }
};




</script>
  
<style lang="scss">
@import "../assets/styles/components/add-ideas.css";
@import "../assets/styles/components/common/pop-up.css";
</style>