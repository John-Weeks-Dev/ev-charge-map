<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { server } from './boot/axios'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user-store'

const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  server.interceptors.response.use(response => response, error => {
    if (error.response.status === 401) {
      userStore.clearUser()
      router.push('/auth')
      console.log('IS EXPIRED!!!', error)
    }
  })
})
</script>
