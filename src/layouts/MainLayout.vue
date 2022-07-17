<template>
  <q-layout id="mainLayout">

    <q-header class="bg-teal">
      <q-toolbar>
        <q-btn
          class="desktop-menu"
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />
        <q-img src="../../logo.png" height="40px" width="40px" />
        <q-toolbar-title class="q-pl-xs">EV Charge Map</q-toolbar-title>
        <q-btn v-if="userStore.email" to="/account" flat round dense icon="account_circle" />
        <q-btn v-else to="/auth" flat round dense icon="login" />
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :width="250"
      >
        <q-scroll-area id="menu-section">
          <q-list padding>
            <q-item clickable v-ripple to="/map">
              <q-item-section avatar>
                <q-icon name="explore" />
              </q-item-section>
              <q-item-section> Map </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/route">
              <q-item-section avatar>
                <q-icon name="directions" />
              </q-item-section>

              <q-item-section> Routes </q-item-section>
            </q-item>

            <q-item v-if="!userStore.email" clickable v-ripple to="/auth">
              <q-item-section avatar>
                <q-icon name="login" />
              </q-item-section>

              <q-item-section> Login </q-item-section>
            </q-item>

            <q-item v-if="userStore.email" clickable v-ripple to="/account">
              <q-item-section avatar>
                <q-icon name="account_circle" />
              </q-item-section>

              <q-item-section> Account </q-item-section>
            </q-item>

            <q-item clickable v-ripple v-if="!pwaIsInstalled && browserType() === 'chrome'" @click="installApp">
              <q-item-section avatar>
                <q-icon name="install_mobile" />
              </q-item-section>

              <q-item-section> Install PWA </q-item-section>
            </q-item>

          </q-list>
        </q-scroll-area>

          <div class="bg-dark text-white q-pa-md absolute-top area-height">
            <q-item-section avatar class="row">
                <div v-if="userStore.getEmail">
                  <q-icon size="20px" name="verified_user" />
                  <span  class="q-pl-sm">{{ userStore.getFirstName }} {{ userStore.getLastName }}</span>
                </div>
                <div v-else>
                  <q-icon size="20px" name="do_not_disturb" />
                  <span  class="q-pl-sm">No user logged in</span>
                </div>
            </q-item-section>
          </div>
      </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer id="mobile-menu" elevated class="bg-white">
      <q-tabs class="bg-teal text-light shadow-2">
        <q-route-tab to="/map" label="Map" name="explore" icon="explore" class="icon-size"/>
        <q-route-tab to="/route" label="Routes" name="directions" icon="directions" class="icon-size"/>
        <q-route-tab v-if="userStore.email" to="/account" label="Account" name="account" icon="account_circle" class="icon-size"/>
        <q-route-tab v-if="!userStore.email" to="/auth" label="auth" name="auth" icon="login" class="icon-size"/>
        <q-route-tab v-if="!pwaIsInstalled && browserType() === 'chrome'" @click="installApp" label="install" name="install" icon="install_mobile" class="icon-size"/>
      </q-tabs>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from 'src/stores/user-store'

const userStore = useUserStore()

const deferredPrompt = ref(null)
const leftDrawerOpen = ref(false)

onMounted(async () => {
  console.log(browserType())
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log(e)
    e.preventDefault()
    deferredPrompt.value = e
  })
})

const browserType = () => {
  const userAgent = navigator.userAgent
  let browserName

  // https://codepedia.info/detect-browser-in-javascript#:~:text=To%20detect%20user%20browser%20information,to%20identify%20the%20user%20browser.&text=Now%20call%20this%20JS%20function,browser%20name%20on%20page%20load.
  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = 'chrome'
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = 'firefox'
  } else if (userAgent.match(/safari/i)) {
    browserName = 'safari'
  } else if (userAgent.match(/opr\//i)) {
    browserName = 'opera'
  } else if (userAgent.match(/edg/i)) {
    browserName = 'edge'
  } else {
    browserName = 'No browser detection'
  }

  return browserName
}

const installApp = async () => {
  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice

  if (outcome === 'dismissed') {
    console.log(`User response to the install prompt: ${outcome}`)
    deferredPrompt.value = null
    return ''
  }
}

const pwaIsInstalled = computed(() => {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('This IS running as standalone.')
    return true
  }

  console.log('This is NOT running as standalone.')
  return false
})
</script>

<style lang="scss">
.area-height {
  height: 50px;
}
#menu-section {
  height: calc(100% - 50px);
  margin-top: 50px;
  border-right: 1px solid #ddd
}
@media (min-width: $breakpoint-sm-max) {
  #mobile-menu {
    display: none;
  }
}

@media (max-width: $breakpoint-sm-max) {
  .desktop-menu {
    display: none;
  }
}
</style>
