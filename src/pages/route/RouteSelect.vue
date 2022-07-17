<template>
  <q-page id="routeSelect">
    <q-toolbar class="bg-teal-8 text-white">
      <q-toolbar-title>Route</q-toolbar-title>
      <q-btn to="/route/saved-routes" flat round dense icon="favorite" color="red"/>
    </q-toolbar>

      <div class="q-pa-md form-style">
        <div class="text-h6 q-pb-md">Where would you like to go?</div>
        <q-input
          tabindex="-1"
          v-model="from"
          @click="setAddress('From')"
          outlined
          label="From"
          stack-label
          error-message="Please enter a from location"
          :error="errors.from"
        >
          <template v-if="from" v-slot:append>
            <q-icon @click="from = ''" name="close" />
          </template>
        </q-input>

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
        >
          <template v-if="to" v-slot:append>
            <q-icon @click="to = ''" name="close" />
          </template>
        </q-input>

        <RangeSlider v-if="range" :range="range" @range="range = $event" />

        <div class="row justify-end q-pt-md">
          <q-btn size="lg" class="full-width" color="black" label="Search" @click="submit"/>
        </div>
      </div>

    <InputAutocomplete
      v-if="show"
      :label="label"
      @address="getAddress($event)"
      @input-visible="show = $event"
    />

  </q-page>
</template>

<script setup>
// IMPORTS
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteStore } from '../../stores/route-store'
import RangeSlider from '../../components/global/RangeSlider'
import InputAutocomplete from '../../components/routePage/InputAutocomplete'

const router = useRouter()
const routeStore = useRouteStore()

// IMPORTS END

// DATA

const show = ref(false)
const from = ref('')
const to = ref('')
const label = ref(null)
const range = ref(0)

const errors = reactive({
  from: null,
  to: null
})
// DATA END

onMounted(() => {
  from.value = routeStore.getFrom ? routeStore.getFrom : ''
  to.value = routeStore.getTo ? routeStore.getTo : ''
  range.value = routeStore.getRange ? routeStore.getRange : 1
})

// METHODS
const setAddress = (newLabel) => {
  show.value = !show.value
  label.value = newLabel
}

const getAddress = (event) => {
  const val = event.label.toLowerCase()
  if (val === 'from') from.value = event.description
  if (val === 'to') to.value = event.description
}

const validation = () => {
  errors.from = from.value.length < 1 ? true : null
  errors.to = to.value.length < 1 ? true : null

  return errors.from || errors.to
}

const submit = () => {
  if (validation()) { return '' }

  // Set route data in pinia
  routeStore.setRoute({
    from: from.value,
    to: to.value,
    range: range.value
  })

  router.push('/map')
}
// METHODS END
</script>

<style lang="scss">
#routeSelect {
  @import '../../assets/form-styles.scss';
}
</style>
