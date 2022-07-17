<template>
  <q-page>

    <q-btn
      v-if="data.route.from && data.route.to"
      @click="showSteps = true"
      class="show-steps-btn"
      color="black"
      text-color="white"
      label="Show journey"
    />

    <ShowSteps
      v-model:showSteps="showSteps"
      v-model:from="data.route.from"
      v-model:to="data.route.to"
      v-model:via="via"
    />

    <div id="map"></div>

    <ChargerInfo
      v-model:clickedLocation="clickedLocation"
      v-model:dialog="dialog"
      v-model:via="via"
      @addToViaArray="addToViaArray"
      @removeFromViaArray="removeFromViaArray"
    />

  </q-page>
</template>

<script setup>
import { googleObject } from '../boot/google'
import { onMounted, reactive, ref, toRaw, watch } from 'vue'
import { axiosOpenCharge } from '../boot/axios'
import { useRouteStore } from '../stores/route-store'
import { debounce } from 'lodash'
import { useQuasar } from 'quasar'
import ChargerInfo from 'src/components/mapPage/ChargerInfo.vue'
import ShowSteps from 'src/components/mapPage/ShowSteps.vue'

const routeStore = useRouteStore()
const $q = useQuasar()

let map = null
let markers = []
let locations = []
let currentZoomNumber = 0
let boundingBoxString = ''
const latLngs = []
const showSteps = ref(false)
const dialog = ref(false)
const clickedLocation = ref(null)
const via = ref([])

const data = reactive({
  route: { from: null, to: null, range: 0 },
  routeResults: null,
  latLngs: []
})

onMounted(async () => {
  if (!navigator.onLine) {
    $q.dialog({
      title: 'Offline',
      message: 'Sorry, but to use GoogleMaps you need to be connected to the internet.',
      persistent: true
    })
    return
  }

  await googleObject()

  data.route.from = routeStore.getFrom
  data.route.to = routeStore.getTo

  map = initMap()

  if (data.routeResults) await getChargePointData(data.routeResults)

  window.google.maps.event.addListener(map, 'zoom_changed', async function (e) {
    currentZoomNumber = map.getZoom()
  })

  window.google.maps.event.addListener(map, 'bounds_changed', async function () {
    const bbox = map.getBounds()
    boundingBoxString = '(' + bbox.vb.hi + ',' + bbox.Ra.hi + '),(' + bbox.vb.lo + ',' + bbox.Ra.lo + ')'
    if (data.route.from === null) { await getChargePointData(null) }
  })
})

/** Init map */
const initMap = () => {
  const directionsService = new window.google.maps.DirectionsService()
  const directionsRenderer = new window.google.maps.DirectionsRenderer()

  const options = {
    center: { lat: 54.5, lng: -3.5 },
    zoom: 6,
    maxZoom: 17,
    fullscreenControl: false,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false
  }

  const map = new window.google.maps.Map(document.getElementById('map'), options)
  // If the "to" direction is set get directions
  if (data.route.to) { getDirections(map, directionsRenderer, directionsService) }

  return map
}

const addToViaArray = (address) => {
  setSelectedMarker(address, true)
  via.value.push(address)
}

const removeFromViaArray = (address) => {
  setSelectedMarker(address, false)
  const array = toRaw(via.value)
  via.value = []

  for (let i = 0; i < array.length; i++) {
    if (array[i][2] === address[2]) {
      array.splice(i, 1)
    }
  }

  for (let i = 0; i < array.length; i++) {
    via.value.push(array[i])
  }
}

const getChargePointData = debounce(async (newRouteResult) => {
  // If markers array is greater than 0 removeMarkers
  if (markers.length > 0) { removeMarkers() }
  let resLatLngs = ''

  // Get the lat lng for the polyline
  if (newRouteResult) {
    newRouteResult.routes[0].legs[0].steps.forEach(step => {
      latLngs.push(`(${step.lat_lngs[0].lat()},${step.lat_lngs[0].lng()})`)
    })
    resLatLngs = latLngs.toString()
  }

  locations = []

  try {
    const res = await axiosOpenCharge.get(
      '?output=json' +
      '&countrycode=GB' +
      `&boundingbox=${currentZoomNumber >= 8 ? boundingBoxString : ''}` +
      `&polyline=${resLatLngs}` +
      `&distance=${routeStore.getRange}` +
      '&compact=false' +
      '&verbose=false' +
      '&maxresults=300' +
      `&key=${process.env.OPEN_MAPS_API_KEY}`
    )

    const result = res.data.map((data, index) => {
      return [
        Number(data.AddressInfo.Latitude), // Lat 0
        Number(data.AddressInfo.Longitude), // Long 1
        data.AddressInfo, // Address 2
        data.Connections, // Connections 3
        data.OperatorInfo // Operator info 4
      ]
    })

    for (let i = 0; i < result.length; i++) { locations.push(result[i]) }

    setMarkers()

    map.setOptions({ minZoom: 5 })
  } catch (error) {
    if (navigator.onLine) {
      $q.notify({
        color: 'negative',
        textColor: 'white',
        icon: 'error',
        message: 'Oops! Something went wrong with this route. Please try another.',
        position: 'top',
        timeout: Math.random() * 5000 + 2000
      })
    }

    if (!navigator.onLine) {
      $q.dialog({
        title: 'Offline',
        message: 'Sorry, but to use GoogleMaps you need to be connected to the internet.',
        persistent: true
      })
    }
  }
}, 400)

/** Set markers */
const setMarkers = () => {
  // Loop all locations
  for (let i = 0; i < locations.length; i++) {
    const singleLocation = locations[i]

    // Add locations to markers
    const marker = new window.google.maps.Marker({
      position: new window.google.maps.LatLng(singleLocation[0], singleLocation[1]),
      map
      // icon: 'http://maps.google.com/mapfiles/ms/icons/green.png'
    })

    // Push the markers to markers array
    markers.push(marker)

    // On click get marker info
    window.google.maps.event.addListener(marker, 'click', function () {
      clickedLocation.value = singleLocation
      dialog.value = true
    })
  }
}

/** Set selected markers */
const setSelectedMarker = (address, markerIsSelected) => {
  // Remove the default marker from the map (NOT FROM THE LOCATIONS ARRAY)
  for (let i = 0; i < markers.length; i++) {
    if (markers[i].position.lat() === address[0] && markers[i].position.lng() === address[1]) {
      markers[i].setMap(null)
    }
  }

  // Get the marker data (ADDRESS, COMPANY, ETC...) from the locations array
  let singleLocation = null
  for (let i = 0; i < locations.length; i++) {
    if (locations[i][0] === address[0] && locations[i][1] === address[1]) {
      singleLocation = locations[i]
    }
  }

  // Add locations to markers
  let image = null
  if (markerIsSelected) {
    image = 'mapIcons/charger.png'
  }

  const marker = new window.google.maps.Marker({
    position: new window.google.maps.LatLng(singleLocation[0], singleLocation[1]),
    map,
    icon: image,
    animation: window.google.maps.Animation.DROP
  })

  // Push the markers to markers array
  markers.push(marker)

  // On click get marker info
  window.google.maps.event.addListener(marker, 'click', function () {
    clickedLocation.value = singleLocation
    dialog.value = true
  })
}

const removeMarkers = () => {
  for (let i = 0; i < locations.length; i++) { markers[i].setMap(null) }
  markers = []
}

// /** Get directions */
const getDirections = (map, directionsRenderer, directionsService) => {
  directionsRenderer.setMap(map)

  const request = {
    origin: data.route.from,
    destination: data.route.to,
    optimizeWaypoints: true, // set to true if you want google to determine the shortest route or false to use the order specified.
    travelMode: 'DRIVING'
  }

  directionsService.route(request, function (result, status) {
    if (status === 'OK') {
      data.routeResults = result
      directionsRenderer.setDirections(result)
    }
  })
}

watch(() => data.routeResults, async (newRouteResult, oldRouteResult) => {
  if (newRouteResult !== null && oldRouteResult === null) {
    await getChargePointData(newRouteResult)
  }
})
// WATCHERS END
</script>

<style lang="scss">
#map {
  width:100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}

.show-steps-btn {
  position:absolute;
  z-index:1;
  margin: 10px;
}

// Remove t&c
.gm-style-cc {
  display: none;
}
</style>
