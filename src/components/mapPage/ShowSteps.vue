<template>
  <q-dialog
    v-model="showStepsComputed"
    id="showSteps"
    persistent
    :maximized="true"
    transition-show="slide-down"
    transition-hide="slide-up"
  >

    <q-card class="text-white bg-teal-8">

    <q-toolbar class="bg-teal">
      <q-icon name="directions_car" dense size="40px" color="yellow"></q-icon>
      <q-toolbar-title class="q-pl-xs">Show Journey</q-toolbar-title>
      <q-space />
      <q-btn class="" dense flat size="md" icon="close" v-close-popup>
        <q-tooltip class="bg-white text-primary">Close</q-tooltip>
      </q-btn>
    </q-toolbar>

      <div class="q-pa-md go-btn">
        <q-btn :disable="via.length < 1" :href="mapLink()" target="_blank" color="black" class="full-width" label="Let's go" />
      </div>

      <q-list class="q-pt-sm list">
        <q-item>
          <q-item-section class="main-section">

            <q-separator spaced inset />

            <q-item>
              <q-item-section>
                <q-item-label class="text-h6">Starting Point</q-item-label>
                <q-item-label>{{ from }}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-icon name="room" color="red" size="40px" />
              </q-item-section>
            </q-item>

            <q-separator spaced inset />

            <div v-if="via.length > 0">
              <div v-for="(v, index) in via" :key="index">
                <q-item>

                  <q-item-section>
                    <q-item-label class="text-h6">Charge Point {{ ++index }}</q-item-label>
                    <q-item-label>{{ v[2] }}</q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-img src="mapIcons/charger.png"></q-img>
                    <q-icon size="40px" />
                  </q-item-section>
                </q-item>

                <q-separator spaced inset />
              </div>
            </div>
            <div v-else>
              <q-item>
                  <q-item-section class="text-center">
                    <div class="text-h6 text-red-4">
                      You have no charge points!
                    </div>
                    Add a charge point to your route!
                  </q-item-section>
                </q-item>

                <q-separator spaced inset />
            </div>

            <q-item>
              <q-item-section>
                <q-item-label class="text-h6">Destination</q-item-label>
                <q-item-label>{{ to }}</q-item-label>
              </q-item-section>

              <q-item-section side center>
                <q-icon name="sports_score" color="white" size="40px" />
              </q-item-section>
            </q-item>

            <q-separator spaced inset />

          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

  </q-dialog>
</template>

<script setup>
import { computed, toRefs } from 'vue'

const emit = defineEmits(['update:showSteps'])

// PROPS
const props = defineProps({
  showSteps: Boolean,
  from: String,
  to: String,
  via: Array
})
const { showSteps, from, to, via } = toRefs(props)
// PROPS END

// COMPUTED
const showStepsComputed = computed({
  get: () => showSteps.value,
  set: (val) => emit('update:showSteps', false)
})

// METHODS
const mapLink = () => {
  // https://www.google.com/maps/dir/?api=1&origin=Paris%2CFrance&destination=Cherbourg%2CFrance&travelmode=driving&waypoints=Versailles%2CFrance%7CChartres%2CFrance%7CLe+Mans%2CFrance%7CCaen%2CFrance
  const fromSection = 'https://www.google.com/maps/dir/?api=1&origin=' + from.value
  const toSection = '&destination=' + to.value + '&travelmode=driving'
  let viaSection = '&waypoints='

  for (let i = 0; i < via.value.length; i++) {
    viaSection += via.value[i][2] + '|'
  }

  return fromSection + toSection + viaSection
}
// METHODS END
</script>

<style lang="scss">
#showSteps {
  .list {
    overflow: scroll;
    position: absolute;
    height: calc(100% - 175px);
    width: 100%;
  }

  .go-btn {
    padding-top: 30px;
    max-width: 400px;
    margin: 0 auto
  }

  .main-section {
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>
