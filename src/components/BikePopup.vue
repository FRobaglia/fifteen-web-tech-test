<template>
    <div class="bike-popup">  
        <v-list>
            <v-list-subheader>Serial number : {{ props.serial_number }}</v-list-subheader>

                <v-list-item v-if="!props.in_order">
                    <v-list-item-avatar>
                        <v-icon size="24" color="#dcdde1">mdi-close-octagon</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title>Out of service</v-list-item-title>
                </v-list-item>
                
                <div v-else>
                    <v-list-item>
                        <v-list-item-avatar>
                            <v-icon size="24" :class="`popup-bike-icon ${['free', 'booked', 'in-use'][props.service_status - 1]}`">mdi-bicycle</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-title>{{ getStatusMessage() }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-avatar>
                            <v-icon size="24" :class="getBatteryStatus(props.battery_level)">{{ `mdi-battery${roundToNearest10(props.battery_level)}` }} </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-title>{{ props.battery_level }}% battery</v-list-item-title>
                    </v-list-item>
                </div>
        </v-list>

        <div class="bike-popup-buttons">
            <button @click="$emit('editBike')" class=" edit-bike-button bike-popup-button">
                {{ props.in_order ? "Put out of service" : "Put back into service" }}
            </button>
            <button @click="$emit('deleteBike')" class=" bike-popup-button">
                Remove Bike
            </button>
        </div>
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

function getBatteryStatus(x: number) {
    if (x >= 60) {
        // Bike's battery is higher or equal to 60
        return "battery-full"
    } else if(x >= 30) {
        // Bike's battery is between 30 and 60
        return "battery-medium"
    } else {
        // Bike's battery is lower than 30
        return "battery-low"
    }
}

function roundToNearest10(x: number) {
  const rounded: number =  Math.ceil(x / 10) * 10;

  if (rounded === 100) return "" // If the battery is full, mdi icon name is mdi-battery
  return `-${rounded}` // Else, mdi icon name is `mdi-battery-{$x}`
}

function getStatusMessage() {
    let statusMessages = ["Free", "Reserved", "In use"]
    return statusMessages[props.service_status - 1]
}
</script>

<style lang="scss">
    @import "@/styles/_variables.scss";

    .mapboxgl-popup-content {
        padding: 0;
        background: none;
    }

    .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
        border-top-color: var(--white);
        transform: translateY(-1px);
    }

    .bike-popup {
        color: var(--black);
        background: var(--white);
        font-size: 14px;
        border-radius: 4px;
        min-width: 215px;

        .v-list {
            background: var(--white);
            border-radius: 4px;
        }

        .v-list-item {
            padding: 0;
            margin-left: -5px;
        }

        .v-list-subheader {
            font-size: 12px;
        }

        .v-list-item-title {
            color: var(--black);
            font-size: 14px;
            white-space: normal;
            text-overflow: clip;
        }
    }

    .battery-full {
      color: $validation;
    }

    .battery-medium {
      color: $warning;
    }

    .battery-low {
      color: $danger;
    }

    .popup-bike-icon {

        &.free {
        color: $validation;
        }

        &.booked {
        color: $warning;
        }

        &.in-use {
        color: $danger;
        }
    }

    .bike-popup-buttons {
        display: flex;
        justify-content: space-between;
        padding: 0 16px 16px 16px;
    }

    .bike-popup-button {
        color: $link;
        text-decoration: underline;
        font-size: 12px;
        display: inline;
    }

    .edit-bike-button {
        padding-right: 16px;
    }

</style>