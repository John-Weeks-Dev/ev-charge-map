<template>
  <div id="registrationPage">

      <q-toolbar class="bg-teal-9 text-white">
        <q-toolbar-title>Register</q-toolbar-title>
      </q-toolbar>

          <q-scroll-area class="form-style">
            <div class="text-h6 text-center q-mt-md">
              <q-img src="../../../logo.png" height="60px" width="60px" />
              <div>Ev Charge Map</div>
            </div>

            <div class="q-pa-md q-gutter-md">

            <div class="text-center q-m-xs">Register and get extra features!</div>

            <q-input
              v-model="firstName"
              outlined
              label="First Name"
              stack-label
              :error-message="errors.firstName.errorMsg"
              :error="errors.firstName.errorType"
            />
            <q-input
              v-model="lastName"
              outlined
              label="Last Name"
              stack-label
              :error-message="errors.lastName.errorMsg"
              :error="errors.lastName.errorType"
            />
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
            <q-input
              v-model="confirmPassword"
              outlined
              label="Confirm Password"
              type="password"
              stack-label
            />
          </div>

          <div class="q-px-md q-pb-lg">
            <div class="row justify-end q-pt-md">
              <q-btn size="lg" class="full-width" color="black" label="Register" @click.prevent="register"/>
            </div>
          </div>

        </q-scroll-area>

      </div>

</template>

<script setup>
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from '../../stores/user-store'

const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const errors = reactive({
  firstName: { errorMsg: null, errorType: null },
  lastName: { errorMsg: null, errorType: null },
  email: { errorMsg: null, errorType: null },
  password: { errorMsg: null, errorType: null },
  confirmPassword: { errorMsg: null, errorType: null }
})

const isValidEmail = (val) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
  return !emailPattern.test(val)
}

const validation = () => {
  let isError = false

  // FirstName
  if (firstName.value.length < 1) {
    errors.firstName.errorMsg = 'Please enter your first name'
    errors.firstName.errorType = true
    isError = true
  } else {
    errors.firstName.errorMsg = null
    errors.firstName.errorType = null
  }
  // FirstName END

  // LastName
  if (lastName.value.length < 1) {
    errors.lastName.errorMsg = 'Please enter your first name'
    errors.lastName.errorType = true
    isError = true
  } else {
    errors.lastName.errorMsg = null
    errors.lastName.errorType = null
  }
  // LastName END

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
  } else if (password.value !== confirmPassword.value) {
    errors.password.errorMsg = 'The passwords you entered do not match'
    errors.password.errorType = true
    isError = true
  } else {
    errors.password.errorMsg = null
    errors.password.errorType = null
  }
  // Password END

  return isError
}

const register = async () => {
  const isError = validation()

  if (isError === true) return false

  if (!navigator.onLine) {
    $q.dialog({
      title: 'Offline',
      message: 'Your registration was unsuccessful. Please make sure you are connection to the internet.',
      persistent: true
    })
    return ''
  }

  $q.loading.show({
    message: 'Give us a sec to get you registered...'
  })

  try {
    // Get the tokens/cookies
    await userStore.getSanctumCookie()
    // Register User
    await userStore.register(
      firstName.value,
      lastName.value,
      email.value,
      password.value,
      confirmPassword.value
    )
    // Get user details
    const res = await userStore.fetchUser()
    // Set user details in localhost (PINIA)
    userStore.setUser(res.data)
    // Redirect
    router.push('/route')

    $q.loading.hide()

    $q.notify({
      type: 'positive',
      position: 'top-left',
      icon: 'check_circle',
      message: 'Welcome, ' + userStore.getFirstName + '!'
    })
  } catch (error) {
    $q.loading.hide()

    $q.dialog({
      title: 'Registration failed',
      message: 'Your registration was unsuccessful. Please make sure that your details are correct.',
      persistent: true
    })
  }
}
</script>

<style lang="scss">
#registrationPage {
  .form-style {
    margin: 0 auto;
    height: calc(100vh - 180px);
    max-width: 500px;
  }

  @media (min-width: $breakpoint-sm-max) {
  .form-style {
    margin: 0 auto;
    height: calc(100vh - 100px);
    max-width: 500px;
  }
}
}

</style>
