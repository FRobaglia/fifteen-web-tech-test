<template>
    <div class="bike-popup">  
        <v-list disabled>
            <v-list-subheader>Numéro de série : {{ props.serial_number }}</v-list-subheader>
                <v-list-item>
                <v-list-item-avatar>
                    <v-icon>{{ `mdi-battery-${roundToNearest10(props.battery_level)}` }} </v-icon>
                </v-list-item-avatar>
                <v-list-item-title>Le vélo est chargé à {{ props.battery_level }}%.</v-list-item-title>
                </v-list-item>
                
                <v-list-item>
                <v-list-item-avatar>
                    <v-icon>mdi-bicycle</v-icon>
                </v-list-item-avatar>
                <v-list-item-title>{{ getStatusMessage() }}</v-list-item-title>
                </v-list-item>
        </v-list>
    </div>
</template>


<script setup lang="ts">

export interface BikePopupProps {
  id: string,
  serial_number: string,
  coordinates: number[],
  in_order: boolean,
  service_status: number,
  battery_level: number
}

const props = defineProps<BikePopupProps>();

function roundToNearest10(x: number) {
  return Math.ceil(x / 10) * 10;
}

function getStatusMessage() {
    let statusMessages = ["Le vélo est libre d'accès.", "Le vélo est réservé", "Le vélo est en cours d'utilisation"]
    return statusMessages[props.service_status - 1]
}
</script>

<style lang="scss">

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .mapboxgl-popup {
        animation: fadeIn .5s ease-in-out;
    }
    .mapboxgl-popup-tip {
        display: none;
    }
</style>