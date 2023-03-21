<template>
    <div class="popupcontainer">
        <div class="fond"></div>
        <form class="newSprintForm">
            <button class="iconBig" type="button" @click="$emit('close')"><img src="https://cdn-icons-png.flaticon.com/512/2976/2976286.png"></button>
            <div class="formInput">
                <label for="titre">Titre du sprint</label><br/>
                <input type="text" name="titre"><br/>
            </div>
            <div class="formInput">
                <label for="matiere">Matière</label><br/>
                <input type="text" name="matiere"><br/>
            </div>
            <div class="formInput">
                <label for="debut">Début</label><br/>
                <input type="text" name="debut"><br/>
            </div>
            <div class="formInput">
                <label for="fin">Fin</label><br/>
                <input type="text" name="fin"><br/>
            </div>
            <div class="formInput">
                <label for="PO">PO</label><br/>
                <input type="text" name="PO"><br/>
            </div>
            <button>Créer un nouveau sprint</button>
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
.newSprintForm{
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
    box-shadow: 0px 5px 5px #bfbfbf;

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