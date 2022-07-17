<template>
   <router-view v-slot="{ Component }">
    <transition
      appear
      enter-active-class="animated bounceInLeft"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AuthPage'
})
</script>
