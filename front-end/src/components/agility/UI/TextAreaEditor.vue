<template>
  <div class="relative">
    <IconButton class="h-fit" :class="btnStyle" type="button" @click="toggleTextAreaEditor">
      <div class="w-[22px] h-[22px] rounded-full border border-[#9ca3af]"></div>
    </IconButton>
    <div class="absolute z-10  flex justify-between mt-4" :class="position" v-if="isTextAreaEdited">
      <div class="modal-body">
        <div class="flex mb-2">
          <button
            :class="{ 'bg-blue-500 text-white': isBold }"
            @click="toggleBold"
            class="bg-gray-300 hover:bg-gray-400 text-black-800 font-semibold py-2 px-4 rounded mr-2"
          >
            Bold
          </button>
          <button
            :class="{ 'bg-blue-500 text-white': isItalic }"
            @click="toggleItalic"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
          >
            Italic
          </button>
		   <button
            :class="{ 'bg-blue-500 text-white': isOblique }"
            @click="toggleOblique"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
          >
            Oblique
          </button>
        </div>
        <div class="flex mb-2">
          <label class="mr-2">Police :</label>
          <select v-model="fontFamily" class="bg-white border border-gray-300 rounded px-2 py-1">
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
          <div class="flex mb-2">
          <label class="mr-2">Alignment :</label>
          <select v-model="fontAlignment" class="bg-white border border-gray-300 rounded px-2 py-1">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div class="flex mb-2">
          <label class="mr-2">Taille :</label>
          <select v-model="fontSize" class="bg-white border border-gray-300 rounded px-2 py-1">
            <option value="12">Petit</option>
            <option value="16">Moyen</option>
            <option value="20">Grand</option>
          </select>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>

defineProps<{
	position: string;
	btnStyle?: string;
}>()
import { ref, computed, watch } from 'vue';


import IconButton from '@/components/common/buttons/Icon.vue';
import { useProjectStore } from '@/store/modules/project.store';
import { GenericContainer } from '@/lib/pixi-tools-v2/class/genericContainer';
import { LineContainer } from '@/lib/pixi-tools-v2/class/lineContainer';
import { FramedContainer } from '@/lib/pixi-tools-v2/class/framedContainer';
import { useThemeStore } from '@/store/modules/theme.store';
import { TextContainer } from '@/lib/pixi-tools-v2/class/textContainer';


const isTextAreaEdited = ref(false);
const isBold = ref(false);
const isItalic = ref(false);
const isOblique = ref(false);


const projectStore = useProjectStore();
const selectedContainers = computed(() => projectStore.getSelected);
const fontFamily = ref('Arial');
const fontAlignment = ref('left');
const fontSize = ref('12');


const toggleTextAreaEditor = () => {
	isTextAreaEdited.value = !isTextAreaEdited.value;
	console.log(isTextAreaEdited.value );
}

watch(isTextAreaEdited, (val) => {
	projectStore.scene.viewport.manager.isEditingContainerProperties = val;
})

const toggleItalic = () => {
  isItalic.value = !isItalic.value;
  const ctn = selectedContainers.value[0]
  if (ctn instanceof TextContainer && isItalic) {
    ctn.textGraphic.textSprite.fontStyle = "italic";
  }
  else  ctn.textGraphic.textSprite.fontStyle = "normal";
}
const toggleBold = () => {
  isBold.value = !isBold.value;
  const ctn = selectedContainers.value[0]
  if (ctn instanceof TextContainer && isBold) {
      ctn.textGraphic.textSprite.fontWeight = "bold";
  }
  else if (ctn instanceof TextContainer) ctn.textGraphic.textSprite.fontWeight = "bold";
  else return;
    projectStore.scene.viewport.socketPlugin.emit(
      'ws-text-updated',
      ctn.uuid,
      ctn.serializeData()
    )
}
const toggleOblique= () => {
  isOblique.value = !isOblique.value;
  const ctn = selectedContainers.value[0]
  if (ctn instanceof TextContainer && isOblique) {
    ctn.textGraphic.textSprite.fontStyle = "oblique";


  }
  else if (ctn instanceof TextContainer) ctn.textGraphic.textSprite.fontStyle = "normal";
  else return;
    projectStore.scene.viewport.socketPlugin.emit(
      'ws-text-updated',
      ctn.uuid,
      ctn.serializeData()
    )
}





const GetTextArea = ()=> {
  const ctn = selectedContainers.value[0]
  if (ctn instanceof TextContainer) {    
  }
			if(parent instanceof TextContainer){
       
			} 
}
</script>
