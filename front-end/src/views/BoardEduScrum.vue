<script setup>
import { useScrumStore } from '@/store/modules/scrum.store.ts'
import { computed, reactive, ref } from 'vue'
import KanbanBoard from '@/components/KanbanBoard.vue'
import ContainerModal from '@/components/modals/ContainerModal.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import SaveIcon from '@/components/icons/SaveIcon.vue'
import GithubIcon from '@/components/icons/GithubIcon.vue'

const store = useScrumStore()
//const displayContainerModal = ref(false)
//const displayCardModal = ref(false)
/*const state = reactive({
  is_editing_title: false,
  temp_title: null,
})*/
const payload = computed(() => {
  return store.getters['fullName']
})


const openRepo = () => {
  window.open('https://github.com/CodingFactory-Repos/Coding-Tools.git', '_blank')
}
</script>

<template>
  <div class="flex h-screen flex-col p-4">
    <div class="flex justify-between">
      <div>
        <Transition name="fade" mode="out-in">
          <!--<div v-if="!state.is_editing_title">
            <span
              class="rounded-md px-2 text-3xl font-bold transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-slate-200"
              @click="handleEditTitle('edit')"
            >
              {{ payload.title }}
            </span>
          </div>-->

          
          <div class="flex place-items-center">
            <input
              v-model="payload.title"
              type="text"
              class="block w-[230px] rounded-lg border border-gray-300 bg-gray-50 p-2 text-xl text-gray-900 transition duration-300 ease-in-out focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add Board Title"
              @keypress.enter="handleEditTitle('save')"
            />
            
            <div class="ml-2 flex place-items-center justify-center">
              <SaveIcon
                height="30px"
                class="mr-2 cursor-pointer rounded-full bg-blue-500 p-1 text-white hover:bg-blue-700"
                @click="handleEditTitle('save')"
              />
              <CloseIcon
                height="30px"
                class="cursor-pointer rounded-full p-1 text-red-500 hover:bg-red-600 hover:text-white"
                @click="handleEditTitle('cancel')"
              />
            </div>
          </div>
        </Transition>
        <h3 class="my-2 px-2 text-sm">

        </h3>
      </div>
      <div class="mt-px flex place-items-start justify-center">
        <div
          class="cursor-pointer rounded-full p-2 text-gray-500 hover:bg-slate-200"
          @click="openRepo"
        >
          <GithubIcon height="30px" />
        </div>
      </div>
    </div>
    <KanbanBoard
      :payload="payload"
      @addContainer="displayContainerModal = true"
    />
  </div>
  <!-- Container Modal -->

  <ContainerModal
    :value="displayContainerModal"
    @close="displayContainerModal = false"
  />
</template>
