<template>
    <div class="iconeGroupe overflow-y-auto">
        <span class="text-gray-800" style="font-size:20px;" >En tant que {{ as }}<br/></span>
        <span class="text-gray-800" style="font-size:20px;" >Je veux {{ iWant }}<br/></span>
        <span class="text-gray-800" style="font-size:20px;" >Afin de {{ soThat }}<br/></span>
        <span class="text-gray-800" style="font-size:20px;" >Critères d'acceptation: {{ acceptationCriteria }}<br/></span>
        <span class="text-gray-800" style="font-size:20px;" >Valeur: {{ valeur }}<br/></span>
        <div v-show="this.options" class="text-gray-800" style="position:absolute;right:10px;bottom:10px;">
            <button><img class="icon" src="https://cdn-icons-png.flaticon.com/512/2089/2089792.png"></button>
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