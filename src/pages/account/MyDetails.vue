<template>
  <q-page id="myDetails">

    <q-toolbar class="bg-teal-9 text-white">
      <q-toolbar-title>My Details</q-toolbar-title>
    </q-toolbar>

    <div class="q-pa-md form-style">

      <div class="text-h6">Update your details</div>

      <q-input
        class="q-mt-md"
        v-model="firstName"
        outlined
        label="First Name"
        stack-label
        :error-message="errors.firstName.errorMsg"
        :error="errors.firstName.errorType"
      />

      <q-input
        class="q-mt-md"
        v-model="lastName"
        outlined
        label="Last Name"
        type="text"
        stack-label
        :error-message="errors.lastName.errorMsg"
        :error="errors.lastName.errorType"
      />

      <div class="text-yellow-10 text-bold q-mt-md">NOTE: Email is read only</div>

      <q-input
        v-model="userStore.getEmail"
        outlined
        readonly
        label="email"
        stack-label
      />

      <q-btn :disable="isChangedComputed" size="lg" class="full-width q-mt-md" color="black" label="Update Details" @click="updateDetails"/>

    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useUserStore } from '../../stores/user-store'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()

const firstName = ref('')
const lastName = ref('')
const isFirstNameSame = ref(false)
const isLastNameSame = ref(false)

const errors = reactive({
  firstName: { errorMsg: null, errorType: null },
  lastName: { errorMsg: null, errorType: null }
})
onMounted(() => {
  firstName.value = userStore.getFirstName ? userStore.getFirstName : ''
  lastName.value = userStore.getLastName ? userStore.getLastName : ''
})

const isChangedComputed = computed(() => {
  if (isFirstNameSame.value) {
    return false
  }

  if (isLastNameSame.value) {
    return false
  }

  return true
})

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

  return isError
}

watch(firstName, (val) => {
  if (val !== userStore.getFirstName) {
    isFirstNameSame.value = true
    return ''
  }
  isFirstNameSame.value = false
})

watch(lastName, (val) => {
  if (val !== userStore.getLastName) {
    isLastNameSame.value = true
    return ''
  }
  isLastNameSame.value = false
})

const updateDetails = async () => {
  const isError = validation()

  if (isError === true) return false

  if (!navigator.onLine) {
    $q.dialog({
      title: 'Offline',
      message: 'Sorry, but to update your details you need to be connected to the internet.',
      persistent: true
    })
  }

  try {
    await userStore.updateUser(firstName.value, lastName.value)

    userStore.setUser({
      first_name: firstName.value,
      last_name: lastName.value
    })

    $q.notify({
      color: 'positive',
      textColor: 'white',
      icon: 'check_circle',
      message: 'You just updated your name to, ' + firstName.value + ' ' + lastName.value,
      position: 'top-left',
      timeout: Math.random() * 5000 + 2000
    })

    router.push('/account')
  } catch (error) {
    $q.notify({
      color: 'negative',
      textColor: 'white',
      icon: 'error',
      message: 'Oops! Something went wrong with this route. Please try another.',
      position: 'top-left',
      timeout: Math.random() * 5000 + 2000
    })
  }
}
</script>

<style lang="scss">
#myDetails {
  @import '../../assets/form-styles.scss';
}
</style>
