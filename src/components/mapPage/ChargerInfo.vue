<template>
  <q-dialog
    v-model="dialogComputed"
    id="chargerInfo"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >

    <q-card class="text-white card-bg-color">

    <q-toolbar class="bg-teal">
      <q-icon name="ev_station" dense size="40px" color="yellow"></q-icon>
      <q-toolbar-title class="q-pl-xs">Charger Info</q-toolbar-title>
      <q-space />
      <q-btn class="" dense flat size="md" icon="close" v-close-popup>
        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
      </q-btn>
    </q-toolbar>

    <q-scroll-area class="main">

      <q-list class="q-mt-lg">

        <q-item>
          <q-item-section >

            <q-item-label class="text-h6 q-pl-sm">Charger Location</q-item-label>

            <q-item-label caption class="q-pa-sm">

              <div class="addressSection" v-if="clickedLocation[2].Title">
                {{ clickedLocation[2].Title }},
              </div>

              <div class="addressSection" v-if="clickedLocation[2].AddressLine1">
                {{ clickedLocation[2].AddressLine1 }},
              </div>

              <div class="addressSection" v-if="clickedLocation[2].AddressLine2">
                {{ clickedLocation[2].AddressLine2 }},
              </div>

              <div class="addressSection" v-if="clickedLocation[2].Town">
                {{ clickedLocation[2].Town }},
              </div>

              <div class="addressSection" v-if="clickedLocation[2].Postcode">
                {{ clickedLocation[2].Postcode }}
              </div>

            </q-item-label>

            <div class="row">
              <q-icon name="power" size="35px" class=""/>
              <div
                :class="{
                  isAvailableClass: clickedLocation[3][0].StatusType.IsOperational,
                  isNotAvailableClass: !clickedLocation[3][0].StatusType.IsOperational
                }"
              >
                {{ clickedLocation[3][0].StatusType.Title }}
              </div>
            </div>

          </q-item-section>
        </q-item>

        <q-separator spaced inset />

        <q-item>
          <q-item-section>

            <q-item-label class="text-h6 q-pl-sm">Connection Type</q-item-label>
            <q-item-label caption class="q-pa-sm">

              <div class="connectionTypeSection" v-if="clickedLocation[3][0].ConnectionType.FormalName">
                Name: {{ clickedLocation[3][0].ConnectionType.FormalName }}
              </div>

              <div class="connectionTypeSection" v-if="clickedLocation[3][0].ConnectionType.Title">
                Title: {{ clickedLocation[3][0].ConnectionType.Title }}
              </div>

              <div class="connectionTypeSection" v-if="clickedLocation[3][0].Level.IsFastChargeCapable">
                Fast charge: <q-icon name="check_circle" color="green-14" size="25px" class="title"/>
              </div>

              <div class="connectionTypeSection" v-else>
                Fast charge: <q-icon name="clear" size="25px" color="red-14" class="title"/>
              </div>

              <div class="connectionTypeSection" v-if="clickedLocation[3][0].ConnectionType.Voltage">
                Title: {{ clickedLocation[3][0].ConnectionType.Voltage }}
              </div>

              <div v-if="useRoute.getFrom && useRoute.getTo" class="q-mt-lg">
                <q-btn v-if="!isMarkerAddresssInViaArray" @click="addMarkerAddress" color="primary" class="full-width" >
                  Add marker to route
                </q-btn>
                <q-btn v-else @click="removeMarkerAddress" color="orange" class="full-width">
                  Remove marker from route
                </q-btn>
              </div>

            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />

        <q-item>
          <q-item-section>

            <q-item-label class="text-h6 q-pl-sm">Company</q-item-label>
            <q-item-label caption>

              <div v-if="clickedLocation[4].Title" class="row companySection">
                <q-icon size="35px" name="business" class="q-mr-sm" color="white"/>
                <div class="companySection">{{ clickedLocation[4].Title }}</div>
              </div>

              <div class="row companySection">
                <div v-if="clickedLocation[4].WebsiteURL" class="addressSection">
                  <q-icon size="35px" name="contact_page" class="q-mr-sm" color="white"/>
                  <a :href="clickedLocation[4].WebsiteURL">{{ clickedLocation[4].WebsiteURL }}</a>
                </div>
              </div>

              <div class="row companySection">
                <div v-if="clickedLocation[4].PhonePrimaryContact">
                  <q-icon size="35px" name="local_phone" class="q-mr-sm" color="white"/>
                  {{ clickedLocation[4].PhonePrimaryContact }}
                </div>
              </div>

              <div class="row companySection">
                <div v-if="clickedLocation[4].ContactEmail">
                  <q-icon size="35px" name="mail" class="q-mr-sm" color="white"/>
                  {{ clickedLocation[4].ContactEmail }}
                </div>
              </div>

            </q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
      </q-scroll-area>

    </q-card>

  </q-dialog>
</template>

<script setup>
import { computed, toRefs } from 'vue'
import { useRouteStore } from 'src/stores/route-store'
const useRoute = useRouteStore()
const emit = defineEmits(['update:dialog', 'addToViaArray', 'removeFromViaArray'])

// PROPS
const props = defineProps({
  dialog: Boolean,
  clickedLocation: Object,
  via: Array
})
const { clickedLocation, dialog, via } = toRefs(props)
// PROPS END

// COMPUTED
const dialogComputed = computed({
  get: () => dialog.value,
  set: (val) => emit('update:dialog', false)
})

const currentMarkerAddress = computed(() => {
  const lat = clickedLocation.value[0]
  const lng = clickedLocation.value[1]
  const addrL1 = !clickedLocation.value[2].AddressLine1 ? '' : clickedLocation.value[2].AddressLine1
  const addrL2 = !clickedLocation.value[2].AddressLine2 ? '' : clickedLocation.value[2].AddressLine2
  const town = !clickedLocation.value[2].Town ? '' : clickedLocation.value[2].Town
  const postcode = !clickedLocation.value[2].Postcode ? '' : clickedLocation.value[2].Postcode
  const title = !clickedLocation.value[2].Country.Title ? '' : clickedLocation.value[2].Country.Title

  const address = addrL1 + ' ' + addrL2 + ' ' + town + ' ' + postcode + ' ' + title
  return [lat, lng, address]
})

const isMarkerAddresssInViaArray = computed(() => {
  for (let i = 0; i < via.value.length; i++) {
    if (via.value[i][2] === currentMarkerAddress.value[2]) {
      return true
    }
  }

  return false
})

const addMarkerAddress = () => {
  dialogComputed.value = true
  setTimeout(() => {
    emit('addToViaArray', currentMarkerAddress.value)
  }, 400)
}

const removeMarkerAddress = () => {
  dialogComputed.value = true
  setTimeout(() => {
    emit('removeFromViaArray', currentMarkerAddress.value)
  }, 400)
}
// COMPUTED END
</script>

<style lang="scss">
#chargerInfo {

  .main {
    height: calc(100vh - 50px);
    margin-top: 30px;
    max-width: 500px;
    margin: 0 auto;
  }

  .row {
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .card-bg-color {
    background-color:rgba(0,0,0, 0.8) !important
  }

  .addressSection {
    font-size: 16px;
    padding-right: 5px;
    line-height: 25px;
    color: rgb(184, 184, 184);
  }

  .connectionTypeSection {
    font-size: 16px;
    padding-right: 5px;
    line-height: 25px;
    color: rgb(184, 184, 184);
  }

  .companySection {
    padding: 5px 0 5px 8px;
    padding-right: 5px;
    line-height: 25px;
    color: rgb(184, 184, 184);
  }

  .addressSection {
    padding-right: 5px;
    font-size: 16px;
    line-height: 25px;
    color: rgb(184, 184, 184);
  }

  .isAvailableClass {
    color: #FFFFFF;
    background-color: $green-14;
    border-radius: 5px;
    padding: 0 10px 0 10px
  }

  .isNotAvailableClass {
    color: #FFFFFF;
    background-color: $red-14;
    border-radius: 5px;
    padding: 0 10px 0 10px
  }

  .green {
    color: rgba(33, 205, 33, 0.865)
  }

  .red {
    color: rgba(218, 51, 51, 0.865);
  }
}
</style>
