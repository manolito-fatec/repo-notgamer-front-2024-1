import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//OpenLayers plugin import
import "vue3-openlayers/styles.css";
import OpenLayersMap from "vue3-openlayers";

//PrimeVue plugin import
import PrimeVue from "primevue/config";
import {
    Map,
    Layers,
    Sources,
    Geometries,
    MapControls,
} from "vue3-openlayers";

const app = createApp(App)



app.use(PrimeVue, {
    unstyled: true
});
app.use(Map,Layers,Sources,Geometries,MapControls)
// app.use(OpenLayersMap);

app.use(router)
// app.use(PrimeVue)
app.mount('#app')
