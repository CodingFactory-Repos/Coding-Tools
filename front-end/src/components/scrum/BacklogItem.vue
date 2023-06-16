<template>
    <div class="dark:bg-[#5C5F73] rounded-lg px-4 py-2 flex flex-col overflow-y-auto text-dark dark:text-white mr-4 mb-2 overflow-y-auto shadow-lg">
        <span style="font-size:20px;" >En tant que {{ as }}<br/></span>
        <span style="font-size:20px;" >Je veux {{ iWant }}<br/></span>
        <span style="font-size:20px;" >Afin de {{ soThat }}<br/></span>
        <span style="font-size:20px;" >Critères d'acceptation: {{ acceptationCriteria }}<br/></span>
        <span style="font-size:20px;" >Valeur: {{ valeur }}<br/></span>
        <div v-show="this.options" style="position:absolute;right:10px;bottom:10px;">
            <button style="background-color:red;"><img class="icon" src="https://cdn-icons-png.flaticon.com/512/542/542724.png" @click="this.$emit('deleteStory', this._id)"></button>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    as: String,
    iWant: String,
    soThat: String,
    acceptationCriteria: String,
    valeur: Number,
    _id: String,
    options: Boolean,
  }
}
</script>