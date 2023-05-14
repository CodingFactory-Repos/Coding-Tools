<template>
    <div class="popupcontainer">
        <div class="fond"></div>
        <form class="newGroupForm">
            <button class="iconBig" type="button" @click="$emit('close')"><img src="https://cdn-icons-png.flaticon.com/512/2976/2976286.png" alt="Close"></button>
            <div class="formInput">
                <label for="name">Nom du groupe</label><br/>
                <input type="text" name="name"><br/>
            </div>
            <div class="formInput">
                <label for="members">Membres (entre 3 et 5)</label><br/>
                <select type="text" name="members"><option></option></select>
            </div>
            <div class="formInput">
                <label for="sprint">Sprint</label><br/>
                <select type="text" name="sprint"><option></option></select>
            </div>
            <button>Créer un nouveau groupe</button>
        </form>
    </div>
</template>

<style>
.popupcontainer {
    z-index: 1;
}
.fond {
    background-color: black;
    opacity: 10%;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
}
.newGroupForm{
    background-color: white;
    width: 50%;
    height: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    padding: 10px;
    z-index: 2;
    border: solid 0.5px black;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
}
.iconBig {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0;
    top: 0;
}
.formInput {
    width: 80%;
}
.formInput input {
    box-shadow: inset 1px 1px 5px #bfbfbf;
    width: 100%;
    border-radius: 3px;
    padding: 1px;
    padding-left: 3px;
}
</style>