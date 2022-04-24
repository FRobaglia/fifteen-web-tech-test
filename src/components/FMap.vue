<template>
  <Loader v-if="!mapHasLoaded"></Loader>
  <FlashMessage :class="{active: listenForClick || flashMessageActive}" :message="flashMessage"></FlashMessage>
  <AddBikeButton @listenClick="listenClick"></AddBikeButton>
  <AddBikePopup @closePopup="popupIsActive = false" :class="{ active: popupIsActive }" :newBikeLat="newBikeLat" :newBikeLng="newBikeLng" @addBike="addBike"></AddBikePopup>
  <HandleThemeButton @toggleTheme="handleTheme"></HandleThemeButton>
  <MapboxMap :class="{listening: listenForClick}" @click="handleClick" @loaded="(map: any) => {handleLoad(map)}" :accessToken="accessToken" :mapStyle="`mapbox://styles/mapbox/${mapTheme}-v10`" :center="props.center" :zoom="9">
    <BikeMarker @editBike="editBike" @deleteBike="deleteBike" v-if="mapHasLoaded && bikesLoaded" v-for="bike in bikes.value" :key="bike.id" :id="bike.id" :serial_number="bike.serial_number" :coordinates="bike.coordinates" :in_order="bike.in_order" :service_status="bike.service_status" :battery_level="bike.battery_level">
    </BikeMarker>
  </MapboxMap>
  
</template>

<script setup lang="ts">
import BikeMarker from "@/components/BikeMarker.vue";
import Loader from "@/components/Loader.vue";
import HandleThemeButton from "@/components/HandleThemeButton.vue";
import AddBikeButton from '@/components/AddBikeButton.vue';
import AddBikePopup from '@/components/AddBikePopup.vue';
import FlashMessage from '@/components/FlashMessage.vue';
import useTheme from '@/composables/useTheme.js';
import { LngLatLike } from "mapbox-gl";
import { MapboxMap } from 'vue-mapbox-ts';
import { ref, reactive, onMounted } from 'vue';


export interface FMapProps {
  center: LngLatLike; // The map initial center coordinates
}

const props = defineProps<FMapProps>();

let mapHasLoaded = ref(false)
const mapTheme = ref(localStorage.getItem("theme") || "light") 

const bikes: Bike[] = reactive([])
const bikesLoaded = ref(true)

let popupIsActive = ref(false)
let flashMessageActive = ref(false)
let listenForClick = ref(false)
let flashMessage = ref("")
let newBikeLat = ref(0)
let newBikeLng = ref(0)

const { toggleTheme } = useTheme();
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

let mapInstance: any = reactive({})

interface Bike {
  id: string,
  serial_number: string,
  coordinates: number[],
  in_order: boolean,
  service_status: number,
  battery_level: number
}

function newFlashMessage(message: string) {
  flashMessage.value = message
  flashMessageActive.value = true
  setTimeout(() => {
    flashMessageActive.value = false
  }, 3000);
}

function listenClick() {
  flashMessage.value = "Click on the map to choose the position of the bike."
  listenForClick.value = true
}

function handleClick(e: any) {
  if (!listenForClick.value) return

  newBikeLat.value = e.lngLat.lat
  newBikeLng.value = e.lngLat.lng
  
  popupIsActive.value = true
  listenForClick.value = false
}

function handleLoad(map: any) {
  mapInstance = map
  mapHasLoaded.value = true
}

function handleTheme() {
  toggleTheme()
  mapTheme.value === "light" ? mapTheme.value = "dark" : mapTheme.value = "light"
  mapInstance.setStyle(`mapbox://styles/mapbox/${mapTheme.value}-v10`)
}

function findBike(id: string) {
  const bike = bikes.value.find((bike: Bike) => bike.id === id);
  return bike
}

function addBike(bike: Bike) {
  fetch(`${import.meta.env.VITE_API_URL}/bikes`, {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(bike)
  })
    .then(res => {
      if (!res.ok) {
        // non-200 response code
        const error = new Error(res.statusText);
        console.error(error)
        throw error;
      }
      return res.json();
    })
    .then(data => {
      bikes.value.push(bike) // update view
      newFlashMessage(`Bike successfully added. (#${bike.serial_number})`)
    })
    .catch(err => {
      if (err.json) {
        return err.json.then(json => {
          console.error(json.message)
        });
      }
    })
}

function deleteBike(id: string) {
  fetch(`${import.meta.env.VITE_API_URL}/bikes/${id}`, {
    method: 'delete',
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) {
        // non-200 response code
        const error = new Error(res.statusText);
        console.error(error)
        throw error;
      }
      return res.json();
    })
    .then(data => {
      let bike = findBike(id)
      const i = bikes.value.indexOf(bike)
      bikes.value.splice(i, 1)
      newFlashMessage(`Bike successfully deleted. (#${bike.serial_number})`)
    })
    .catch(err => {
      if (err.json) {
        return err.json.then(json => {
          console.error(json.message)
        });
      }
    })
}

function editBike(id: string, in_order: boolean) {
  fetch(`${import.meta.env.VITE_API_URL}/bikes/${id}`, {
    method: 'put',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({in_order: !in_order})
  })
    .then(res => {
      if (!res.ok) {
        // non-200 response code
        const error = new Error(res.statusText);
        console.error(error)
        throw error;
      }
      return res.json();
    })
    .then(data => {
      let bike = findBike(id)
      bike.in_order = !bike.in_order
      newFlashMessage(`Bike successfully edited. (#${bike.serial_number})`)
    })
    .catch(err => {
      if (err.json) {
        return err.json.then(json => {
          console.error(json.message)
        });
      }
    })
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

<style lang="scss">
.mapbox-map.listening {
  .mapboxgl-canvas-container { 
    cursor: crosshair !important // Change cursor when listening for click to add a new bike
  }
}
</style>
