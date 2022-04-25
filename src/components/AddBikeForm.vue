<template>
  <div class="overlay">
      <form class="add-bike-form" novalidate @submit.prevent="onSubmit">
        <v-icon @click="emit('closePopup')" size="32" class="form-close">
            mdi-close
        </v-icon>

        <div class="form-coordinates">
            <p> Latitude :  {{ props.newBikeLat }} </p>
            <p> Longitude : {{ props.newBikeLng }}</p>
        </div>

        <label for="service_status">Bike status</label>
        <select :v-model="serviceStatus" name="service_status" id="service_status">
            <option selected value="1">Free</option>
            <option value="2">Reserved</option>
            <option value="3">In use</option>
        </select>
        
        <label for="battery_level">Battery level</label>
        <input v-model="battery" type="number" min="0" max="100" step="1" id="battery_level" name="battery_level" />
        
        <input v-model="inOrder" type="checkbox" id="in_order" name="in_order">
        <label for="in_order">Out of service</label>
        
        <div class="form-error"> {{errorMessage}} </div>

        <v-btn
            color="success"
            class="add-bike-button"
            type="submit"
        >
            Add new bike
        </v-btn>
      </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from "vue";
import { customAlphabet } from 'nanoid';

export interface addBikeFormProps {
    newBikeLat: number,
    newBikeLng: number
}

const props = defineProps<addBikeFormProps>();
const emit = defineEmits()

let serviceStatus = ref("")
let inOrder = ref(false)
let battery = ref(50)
let errorMessage = ref("")

// const nanoId = customAlphabet('1234567890abcdef', 24);
const nanoSerialNumber = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6); // Generate serial number

function onSubmit(e: any) {

  
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  
  if (formProps.battery_level < 0 || formProps.battery_level > 100) {
      errorMessage.value = "Battery level must be between 0 and 100."
      return;
  }

  const bike = {
      serial_number: nanoSerialNumber(),
      coordinates: [props.newBikeLat, props.newBikeLng],
      in_order: formProps.in_order ? false : true,
      service_status: parseInt(formProps.service_status),
      battery_level: parseInt(formProps.battery_level)
  }
  
  emit("closePopup")
  emit("addBike", bike)
}
</script>

<style scoped lang="scss">
@import "@/styles/_variables.scss";

.overlay {
    position: absolute;
    z-index: 15;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(33 ,33 ,33 , .6);
    visibility: hidden;
    transition: .2s ease;

    &.active {
        visibility: visible;
    }
}
.add-bike-form {
    position: absolute;
    padding: 25px;
    width: 600px;
    max-width: 95%;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
    border-radius: 6px;
    background: var(--primary);
    color: var(--secondary);
    box-shadow: 0px 0px 20px 3px rgba(0,0,0,0.3);

    .form-close {
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
    }

    .form-coordinates {
        color: grey;
        font-size: 13px;
        margin-bottom: 32px;
    }

    .form-error {
        color: $danger;
        margin-bottom: 12px;
    }

    label, input, select {
        display: block;
    }

    label {
        margin-bottom: 4px;
    }

    input, select {
        width: 100%;
        color: var(--secondary);
        margin-bottom: 32px;
        padding: 12px;
        background-color: rgb(100, 100, 100, .15);
    }

    select {
        // Smoother arrow for select instead of native arrow
        background-image: url("data:image/svg+xml,<svg height='10px' width='10px' viewBox='0 0 16 16' fill='%23000000' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>");
        background-repeat: no-repeat;
        background-position: calc(100% - 0.75rem) center !important;
        -moz-appearance: none !important;
        -webkit-appearance: none !important; 
        appearance: none !important;
    }

    option {
        background: var(--white);
        color: var(--black);
    }

    input[type='checkbox'] {
        display: inline-block;
        width: auto;
        margin-right: 12px;
        margin-bottom: 16px;

        + label {
            display: inline;
            margin-right: 24px;
        }
    }
}
</style>