<template>
  <div id="loginPage">

      <q-toolbar class="bg-teal-9 text-white">
        <q-toolbar-title>Login</q-toolbar-title>
      </q-toolbar>

      <q-scroll-area class="form-style">

        <div class="text-h6 text-center q-mt-md">
          <q-img src="../../../logo.png" height="60px" width="60px" />
          <div>Ev Charge Map</div>
        </div>

        <div class="q-pa-md q-gutter-md">
          <q-input
            v-model="email"
            outlined
            label="Email"
            stack-label
            :error-message="errors.email.errorMsg"
            :error="errors.email.errorType"
          />

          <q-input
            v-model="password"
            outlined
            label="Password"
            type="password"
            stack-label
            :error-message="errors.password.errorMsg"
            :error="errors.password.errorType"
          />

          <div class="row justify-end">
            <q-btn size="lg" class="full-width" color="black" label="Login" @click="login"/>
          </div>

        <div class="q-px-md q-mt-xl text-center">
          <div style="font-size: 17px" class="q-mb-md">Don't have an account?</div>
          <q-btn id="add-icon" color="teal" outline rounded to="/auth/register" size="15px"> Register Here</q-btn>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores/user-store'
import { useRouteStore } from 'src/stores/route-store'
import { reactive, ref } from 'vue'

const userStore = useUserStore()
const routeStore = useRouteStore()
const router = useRouter()
const $q = useQuasar()

const email = ref('')
const password = ref('')

const errors = reactive({
  email: { errorMsg: null, errorType: null },
  password: { errorMsg: null, errorType: null }
})

const isValidEmail = (val) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return !emailPattern.test(val)
}

const validation = () => {
  let isError = false

  // Email
  if (email.value.length < 1) {
    errors.email.errorMsg = 'Please enter your email'
    errors.email.errorType = true
    isError = true
  } else if (email.value.length > 0 && isValidEmail(email.value)) {
    errors.email.errorMsg = 'The email you entered is not valid'
    errors.email.errorType = true
    isError = true
  } else {
    errors.email.errorMsg = null
    errors.email.errorType = null
  }
  // Email END

  // Password
  if (password.value.length < 1) {
    errors.password.errorMsg = 'Please enter your password'
    errors.password.errorType = true
    isError = true
  } else if (password.value.length > 0 && password.value.length < 8) {
    errors.password.errorMsg = 'The minimum password length is 8 characters'
    errors.password.errorType = true
    isError = true
  } else {
    errors.password.errorMsg = null
    errors.password.errorType = null
  }
  // Password END

  return isError
}

const login = async () => {
  const isError = validation()

  if (isError) return false

  if (!navigator.onLine) {
    $q.dialog({
      title: 'Offline',
      message: 'Your login was unsuccessful. Please make sure that you are connected to the internet.',
      persistent: true
    })
    return ''
  }

  try {
    // Get the tokens/cookies
    await userStore.getSanctumCookie()
    // Login user
    await userStore.login(email.value, password.value)
    // Get the user
    const user = await userStore.fetchUser()
    console.log(user)
    // Set user data in localstorage (PINIA)
    userStore.setUser(user.data)
    // Get sasved user routes
    routeStore.showAllSavedRoutesByUserId(userStore.id)
    // Redirect
    router.push('/route')

    $q.notify({
      type: 'positive',
      position: 'top-left',
      icon: 'check_circle',
      message: 'Welcome back, ' + userStore.getFirstName + '!'
    })
  } catch (error) {
    $q.dialog({
      title: 'Login failed',
      message: 'Your login was unsuccessful. Please make sure that your details are correct.',
      persistent: true
    })
  }
}
</script>

<style lang="scss">
#loginPage {
  @import '../../assets/form-styles.scss';
}
</style>
