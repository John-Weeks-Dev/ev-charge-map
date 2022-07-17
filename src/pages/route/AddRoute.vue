<template>
  <q-page id="addRoute">

    <q-toolbar class="bg-teal-8 text-white">
      <q-toolbar-title>Add Route</q-toolbar-title>
      <q-btn to="/route/saved-routes" flat round dense icon="favorite" color="red" />
    </q-toolbar>

      <q-scroll-area class="q-pa-md form-style">
        <div class="text-h6 q-pb-md">Save your favorite routes!</div>
        <span class="text-body1 q-pb-md">Pick a name for this route</span>

        <q-input
          v-model="name"
          outlined
          label="Name"
          stack-label
          error-message="Please enter a name for this route"
          :error="errors.name"
        />
        <div class="text-body1 q-pt-md">Add your locations</div>
        <q-input
          tabindex="-1"
          v-model="from"
          @click="setAddress('From')"
          outlined
          label="From"
          stack-label
          error-message="Please enter a from location"
          :error="errors.from"
        />
        <q-input
          class="q-pt-md"
          tabindex="-1"
          v-model="to"
          @click="setAddress('To')"
          outlined
          label="To"
          stack-label
          error-message="Please enter a to location"
          :error="errors.to"
        />

        <RangeSlider v-if="range" :range="range" @range="range = $event" />

        <div class="row justify-end q-pt-md">
          <q-btn size="lg" class="full-width" color="black" label="Save Route" @click="addRoute"/>
        </div>
      </q-scroll-area>

    <InputAutocomplete
      v-if="show"
      :label="label"
      @address="getAddress($event)"
      @input-visible="show = $event"
    />

  </q-page>
</template>

<script setup>
import { server } from '../../boot/axios'
import RangeSlider from '../../components/global/RangeSlider'
import InputAutocomplete from '../../components/routePage/InputAutocomplete'
import { onMounted, reactive, ref } from 'vue'
import { useUserStore } from '../../stores/user-store'
import { useRouteStore } from '../../stores/route-store'
import { useQuasar } from 'quasar'

import { useRouter } from 'vue-router'
const userStore = useUserStore()
const routeStore = useRouteStore()
const router = useRouter()
const $q = useQuasar()

const show = ref(false)
const name = ref('')
const from = ref('')
const to = ref('')
const label = ref(null)
const range = ref(1)

const errors = reactive({
  name: null,
  from: null,
  to: null
})

onMounted(() => {
  newRouteNotification()
})

const setAddress = (newLabel) => {
  show.value = !show.value
  label.value = newLabel
}

const getAddress = (event) => {
  if (event.label.toLowerCase() === 'from') from.value = event.description
  if (event.label.toLowerCase() === 'to') to.value = event.description
}

const validation = () => {
  errors.name = name.value.length < 1 ? true : null
  errors.from = from.value.length < 1 ? true : null
  errors.to = to.value.length < 1 ? true : null
}

const addRoute = async () => {
  validation()

  if (errors.name || errors.from || errors.to) {
    return false
  }

  if (!navigator.onLine) {
    $q.dialog({
      title: 'Offline',
      message: 'Your route can\'t be added. Please make sure you are connection to the internet.',
      persistent: true
    })
    return ''
  }

  try {
    await server.post('/api/routes', {
      user_id: userStore.id,
      name: name.value,
      from: from.value,
      to: to.value,
      range: range.value
    })

    await routeStore.showAllSavedRoutesByUserId(userStore.id)

    router.push('/route/saved-routes')
  } catch (error) {
    console.log(error)
  }
}

const newRouteNotification = () => {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification')
    return
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification('Hi there!')
    console.log(notification)
  }
}

</script>

<style lang="scss">
#addRoute {
  @import '../../assets/form-styles.scss';
}
</style>
