<template>
  <div id="favoriteRoutes">

    <q-toolbar class="bg-teal-8 text-white">
      <q-toolbar-title>Saved Routes</q-toolbar-title>
      <q-btn @click="isLoggedInAddRoute" flat round dense size="20px" icon="add" />
    </q-toolbar>

    <div v-if="favoriteRoutes.length > 0" class="section-title">
      <div class="text-h6 q-mx-sm">Select one of your saved routes!</div>
    </div>

    <div v-if="favoriteRoutes.length < 1" class="text-center q-pt-lg">
      <q-btn
        @click="isLoggedInAddRoute"
        flat
        round
        dense
        size="33px"
        icon="add_circle_outline"
      />
      <div class="text-h6">Add some routes!</div>
      <div class="q-pa-md info">This is where you can add your favourite or most common journeys!</div>
    </div>

    <q-scroll-area v-else class="list">
      <q-separator spaced inset />

      <q-list v-for="favoriteRoute in favoriteRoutes" :key="favoriteRoute.name" @click="card = !card">

      <q-item>
        <q-item-section top avatar>
          <q-avatar color="green" text-color="white" icon="directions" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ favoriteRoute.name }}</q-item-label>
          <q-item-label caption>
            <div class="q-px-sm q-pb-xs"><b>From</b>: {{ favoriteRoute.from }}</div>
            <div class="q-px-sm q-pb-xs"><b>To</b>: {{ favoriteRoute.to }}</div>
            <div class="q-px-sm"><b>Search Radius</b>: {{ favoriteRoute.range }} Miles</div>
          </q-item-label>
        </q-item-section>

        <q-item-section side bottom>
          <q-btn
              class="q-ma-sm"
              size="sm"
              color="green"
              label="Go to map"
              @click="showSavedRouteOnMap (favoriteRoute.from, favoriteRoute.to, favoriteRoute.range)"
            />
            <q-btn class="q-mx-xs" size="sm" color="red" label="Delete" @click="deleteSavedRouteOnMap(favoriteRoute)"/>
        </q-item-section>

      </q-item>

      <q-separator spaced inset />

    </q-list>
    </q-scroll-area>

  </div>
</template>

<script setup>
// IMPORTS
import { server } from 'src/boot/axios'
import { useRouter } from 'vue-router'
import { useRouteStore } from '../../stores/route-store'
import { useUserStore } from '../../stores/user-store'
import { ref } from '@vue/reactivity'
import { useQuasar } from 'quasar'
import { onMounted } from 'vue-demi'

const router = useRouter()
const routeStore = useRouteStore()
const userStore = useUserStore()
const $q = useQuasar()
// IMPORTS END

// DATA
const card = ref(false)
const favoriteRoutes = ref([])
// DATA END

onMounted(() => {
  if (routeStore.getSavedRoutes) favoriteRoutes.value = routeStore.getSavedRoutes
})

const isLoggedInAddRoute = () => {
  if (!userStore.email) {
    const res = $q.dialog({
      title: 'You\'re not logged in!',
      message: 'Login to add and see your favourite routes',
      cancel: true,
      persistent: true
    })

    res.onOk(() => {
      router.push('/auth')
    })

    return
  }
  router.push('/route/add-route')
}

const showSavedRouteOnMap = (from, to, range) => {
  routeStore.setRoute({ from, to, range })
  router.push('/map')
}

const deleteSavedRouteOnMap = async (savedRoute) => {
  const dialogRes = $q.dialog({
    title: `Delete Route "${savedRoute.name}"`,
    message: 'Are you sure you want to delete this route?',
    cancel: true,
    persistent: true
  })

  dialogRes.onOk(async () => {
    try {
      await server.delete(`/api/routes/${savedRoute.id}`)
      await routeStore.showAllSavedRoutesByUserId(userStore.getId)
      favoriteRoutes.value = routeStore.getSavedRoutes
    } catch (error) {
      console.log(error)
    }
  })
}
</script>

<style lang="scss">
  #favoriteRoutes {

    .section-title {
      padding: 12px 10px 8px 10px;
      max-width: 500px;
      margin: 0 auto;
    }

    .info {
      font-size: 16px;
    }

    .borderBottom {
      border-bottom: 1px solid rgb(201, 201, 201);
    }

    .list {
      margin: 0 auto;
      height: calc(100vh - 250px);
      max-width: 500px;
    }
  }
</style>
