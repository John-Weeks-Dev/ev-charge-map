<template>
  <q-page id="accountMenu">
    <q-toolbar class="bg-teal-8 text-white">
      <q-toolbar-title>Account</q-toolbar-title>
    </q-toolbar>

    <div class="text-h6 q-pa-xl text-center">
      <q-avatar size="60px" color="green">{{ getFirstLettersOfName() }}</q-avatar>
      <div>{{ capFirstLettersOfFullName() }}</div>
    </div>

    <div class="menu">
      <q-separator inset />

      <q-list class="q-mx-md">
        <q-item clickable v-ripple @click="router.push('/account/my-details')">
          <q-item-section avatar>
            <q-avatar rounded color="primary" text-color="white" icon="account_box" />
          </q-item-section>
          <q-item-section class="text-size">My Details</q-item-section>
          <q-item-section side>
            <q-icon name="arrow_right" size="35px"></q-icon>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator inset />

      <q-list class="q-mx-md">
        <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
            <q-avatar rounded color="red" text-color="white" icon="logout" />
          </q-item-section>
          <q-item-section class="text-size">Logout</q-item-section>
          <q-item-section side>
            <q-icon name="arrow_right" size="35px"></q-icon>
          </q-item-section>
        </q-item>
      </q-list>

      <q-separator inset />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useUserStore } from '../../stores/user-store'
import { useRouteStore } from '../../stores/route-store'
import { useRouter } from 'vue-router'
const $q = useQuasar()
const userStore = useUserStore()
const routeStore = useRouteStore()
const router = useRouter()

const logout = () => {
  if (!navigator.onLine) {
    $q.dialog({
      title: 'Offline',
      message: 'Sorry, but to Logout you need to be connected to the internet.',
      persistent: true
    })
    return
  }

  const res = $q.dialog({
    title: 'Logout!',
    message: 'Are you sure you want to logout?',
    cancel: true,
    persistent: true
  })

  res.onOk(async () => {
    try {
      await userStore.logout()
      routeStore.clearRoute()
      userStore.clearUser()
      router.push('/map')
    } catch (error) {
      console.log(error)
    }
  })
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
const getFirstLetter = (string) => {
  return string.charAt(0)
}

const getFirstLettersOfName = () => {
  if (userStore.firstName && userStore.lastName) {
    const fname = capitalizeFirstLetter(userStore.firstName)
    const lname = capitalizeFirstLetter(userStore.lastName)

    return getFirstLetter(fname) + getFirstLetter(lname)
  }
}

const capFirstLettersOfFullName = () => {
  if (userStore.firstName && userStore.lastName) {
    const fname = capitalizeFirstLetter(userStore.firstName)
    const lname = capitalizeFirstLetter(userStore.lastName)

    return fname + ' ' + lname
  }
}
</script>

<style lang="scss">
#accountMenu {

  .menu {
    margin: 0 auto;
    max-width: 500px;
  }

  .text-size {
    font-size: 18px;
  }
}

</style>
