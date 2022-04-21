<template>
  <Loader v-if="!mapHasLoaded"></Loader>
  <HandleTheme @toggleTheme="applyTheme"></HandleTheme>
  <MapboxMap @loaded="(map: any) => {handleLoad(map)}" :accessToken="accessToken" :mapStyle="`mapbox://styles/mapbox/${mapTheme}-v10`" :center="props.center" :zoom="9">
    <BikeMarker v-if="mapHasLoaded && bikesLoaded" v-for="bike in bikes.value" :key="bike.id" :id="bike.id" :serial_number="bike.serial_number" :coordinates="bike.coordinates" :in_order="bike.in_order" :service_status="bike.service_status" :battery_level="bike.battery_level">
    </BikeMarker>
  </MapboxMap>
  
</template>

<script setup lang="ts">
import BikeMarker from "@/components/BikeMarker.vue";
import Loader from "@/components/Loader.vue";
import HandleTheme from "@/components/HandleTheme.vue";
import useTheme from '@/composables/useTheme.js';
import { LngLatLike } from "mapbox-gl";
import { MapboxMap } from 'vue-mapbox-ts';
import { ref, reactive, onMounted } from 'vue';


export interface FMapProps {
  center: LngLatLike; // The map initial center coordinates
}

const props = defineProps<FMapProps>();

let mapHasLoaded = ref(false)
const bikes = reactive([])
const bikesLoaded = ref(true)
const error = ref(null)

const { toggleTheme } = useTheme();
const mapTheme = ref(localStorage.getItem("theme") || "light") 
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

let mapInstance: any = reactive({})

function handleLoad(map: any) {
  mapInstance = map
  mapHasLoaded.value = true
}

function applyTheme() {
  toggleTheme()
  mapTheme.value === "light" ? mapTheme.value = "dark" : mapTheme.value = "light"
  mapInstance.setStyle(`mapbox://styles/mapbox/${mapTheme.value}-v10`)
}

async function fetchBikes() {
  bikesLoaded.value = false;
  return fetch(`${import.meta.env.VITE_API_URL}/bikes`, {
    method: 'get',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) {
        // non-200 response code
        const error = new Error(res.statusText);
        throw error;
      }
      return res.json();
    })
    .then(data => {
      // set the response data
      bikes.value = data.bikes;
    })
    .catch(err => {
      error.value = err;
      if (err.json) {
        return err.json.then(json => {
          error.value.message = json.message;
        });
      }
    })
    .then(() => {
      bikesLoaded.value = true;
    });
}

onMounted(() => {
  fetchBikes()
});
</script>
