<template>
    <transition appear enter-active-class="animated zoomInUp">

      <q-page id="inputContainer">
        <div class="head">
          <q-input class="input" v-model="input" outlined autofocus color="white" bg-color="white" label-color="black" :label="label">
            <template v-slot:append>
              <q-icon @click="emit('input-visible', false)" name="close" />
            </template>
          </q-input>
        </div>
        <div class="addresses">
          <div v-for="(addr, index) in addresses" :key="index" class="address-data">
            <q-list separator>
              <q-item clickable v-ripple @click="getAddress(label, addr.description)">
                <q-item-section>{{ addr.description }}</q-item-section>
              </q-item>
            </q-list>
            <q-separator />
          </div>
        </div>
      </q-page>

    </transition>
</template>

<script setup>
// IMPORT SECTION
import { watch, toRefs, ref } from 'vue'
import { debounce } from 'lodash'
import { server } from '../../boot/axios'
import { useUserStore } from '../../stores/user-store'
import { useQuasar } from 'quasar'

const userStore = useUserStore()
const $q = useQuasar()
// IMPORT SECTION END

// DATA
const input = ref(null)
const addresses = ref(null)
// DATA END

// PROPS
const props = defineProps({ label: { type: String, default: '' } })
const { label } = toRefs(props)
// PROPS END

// EMITS
const emit = defineEmits(['address', 'input-visible'])
// EMITS END

// METHODS
const getAddress = (label, description) => {
  const addressDetails = { label, description }
  emit('address', addressDetails)
  emit('input-visible', false)
}

const getPlaces = debounce(async (newVal) => {
  if (!navigator.onLine) {
    $q.dialog({
      title: 'Offline',
      message: 'Sorry, but to use the address search you need to be connected to the internet.',
      persistent: true
    })
    return
  }

  try {
    // Get the tokens/cookies
    await userStore.getSanctumCookie()

    // Get places
    const res = await server.post('api/places', { input: newVal })
    addresses.value = res.data.places.predictions
  } catch (error) {
    $q.dialog({
      title: 'Error',
      message: 'Oops! Something went wrong with this route. Please try again.',
      persistent: true
    })
    console.log(error)
  }
}, 500)
// METHODS END

// WATCH
watch(() => input.value, getPlaces)
// WATCH END
</script>

<style lang="scss">
#inputContainer {
  position: absolute;
  width: 100%;
  background-color: white;
  top: 0;

  .head {
    position: absolute;
    top: 0;
    width: 100%;
    height: 95px;
    background-color: $teal-9;
    padding: 20px 15px;
  }

  .input {
    max-width: 500px;
    margin: 0 auto;
  }

  .addresses {
    padding: 15px;
    margin-top: 90px;
    overflow-y: auto;
    height: 10;
  }

  .address-data {
    font-size: 18px;
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
