// Pinia Store
import axios from 'axios'
import { defineStore } from 'pinia'
import vuexStore from '@/store' // for gradual conversion, see fullUserDetails

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

export const useScrumStore = defineStore('scrum', {
  // convert to a function
  state: (): State => ({
    firstName: 'Test',
    lastName: 'test',
    userId: null
  }),
  getters: {
    // firstName getter removed, no longer needed
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    getData(state) {
      return state
    }
  },
  actions: {
    setVuello({ commit }, data) {
      commit('SET_VUELLO', data)
    },
    SET_VUELLO(state, data) {
      state.vuello = data
    }
  }
})