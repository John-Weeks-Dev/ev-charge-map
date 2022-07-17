import { defineStore } from 'pinia'
import { server } from '../boot/axios'

export const useRouteStore = defineStore('route', {
  state: () => ({
    from: null,
    to: null,
    range: null,
    savedRoutes: null
  }),
  getters: {
    getFrom: (state) => {
      return state.from
    },
    getTo: (state) => {
      return state.to
    },
    getRange: (state) => {
      return state.range
    },
    getSavedRoutes: (state) => {
      return state.savedRoutes
    }
  },
  actions: {
    async showAllSavedRoutesByUserId (id) {
      try {
        const res = await server.get(`/api/user/routes/${id}`)
        this.savedRoutes = res.data.routesByUserId
        return true
      } catch (error) {
        if (error) throw error
      }
    },

    setRoute (payload) {
      this.from = payload.from
      this.to = payload.to
      this.range = payload.range
    },

    clearRoute () {
      this.from = null
      this.to = null
      this.range = null
      this.savedRoutes = null
    },

    setSavedRoutes ({ commit }, payload) {
      this.savedRoutes.push(payload)
    }
  },
  persist: true
})
