import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { store } from './store'
import VueMapboxTs from "vue-mapbox-ts";

loadFonts()

const app = createApp(App)

app.use(store)
app.use(vuetify)
app.use(VueMapboxTs)
app.mount('#app')
