import { boot } from 'quasar/wrappers'
import axios from 'axios'

const server = axios.create({ baseURL: 'http://localhost:8000' })
server.defaults.withCredentials = true

const axiosOpenCharge = axios.create({ baseURL: 'https://api.openchargemap.io/v3/poi/' })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$axiosOpenCharge = axiosOpenCharge
  app.config.globalProperties.$server = server
})

export { server, axios, axiosOpenCharge }
