import { defineStore } from 'pinia'
import { server } from '../boot/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    firstName: null,
    lastName: null,
    email: null
  }),
  getters: {
    getId: (state) => {
      return state.id
    },
    getFirstName: (state) => {
      return state.firstName
    },
    getLastName: (state) => {
      return state.lastName
    },
    getEmail: (state) => {
      return state.email
    }
  },
  actions: {
    async getSanctumCookie () {
      try {
        await server.get('sanctum/csrf-cookie')
      } catch (error) {
        if (error) throw error
      }
    },

    async login (email, password) {
      try {
        await server.post('login', { email, password })
      } catch (error) {
        if (error) throw error
      }
    },

    async register (firstName, lastName, email, password, confirmPassword) {
      try {
        await server.post('/register', {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          password_confirmation: confirmPassword
        })
      } catch (error) {
        if (error) throw error
      }
    },

    async logout () {
      try {
        await server.post('/logout')
        this.clearUser()
      } catch (error) {
        if (error) throw error
      }
    },

    async fetchUser () {
      try {
        return await server.get('api/user')
      } catch (error) {
        if (error) throw error
      }
    },

    async updateUser (firstName, lastName) {
      try {
        return await server.put('api/user', { first_name: firstName, last_name: lastName })
      } catch (error) {
        if (error) throw error
      }
    },

    setUser (payload) {
      if (payload.id) this.id = payload.id
      if (payload.first_name) this.firstName = payload.first_name
      if (payload.last_name) this.lastName = payload.last_name
      if (payload.email) this.email = payload.email
    },

    clearUser () {
      this.id = null
      this.first_name = null
      this.last_name = null
      this.email = null
    }
  },
  persist: true
})
