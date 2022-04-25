<template>
    <div class="bike-popup">  
        <v-list>
            <v-list-subheader>Serial number : {{ props.serial_number }}</v-list-subheader>

                <v-list-item v-if="!props.in_order">
                    <v-list-item-avatar>
                        <v-icon size="24" color="var(--secondary)">mdi-close-octagon</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-title>Bike is out of service</v-list-item-title>
                </v-list-item>
                
                <div v-else>
                    <v-list-item>
                        <v-list-item-avatar>
                            <v-icon size="24" :class="`popup-bike-icon ${['free', 'booked', 'in-use'][props.service_status - 1]}`">mdi-bicycle</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-title>Bike is {{ getStatusMessage() }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item>
                        <v-list-item-avatar>
                            <v-icon size="24" :class="getBatteryStatus(props.battery_level)">{{ `mdi-battery${roundToNearest10(props.battery_level)}` }} </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-title>Bike has {{ props.battery_level }}% battery</v-list-item-title>
                    </v-list-item>
                </div>
        </v-list>

        <div class="popup-buttons">
            <v-btn
             @click="$emit('editBike')" class="edit-bike-button " 
                size="x-small"
                flat
                variant="outlined"
                color="var(--secondary)"
            >
                {{ props.in_order ? "Put out of service" : "Put back in service" }}
            </v-btn>
            <v-btn
             @click="$emit('deleteBike')" class="" 
                size="x-small"
                flat
                variant="outlined"
                color="#ff7675"
            >
                Remove Bike
            </v-btn>
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
  // Rounds battery level to the nearest ten to get a relevant battery icon using mdi
  const rounded: number =  Math.ceil(x / 10) * 10;

  if (rounded === 100) return "" // If the battery is full, mdi icon name is mdi-battery
  return `-${rounded}` // Else, mdi icon name is `mdi-battery-{$x}`
}

function getStatusMessage() {
    let statusMessages = ["free", "reserved", "in use"]
    return statusMessages[props.service_status - 1]
}
</script>

<style lang="scss">
    @import "@/styles/_variables.scss";

    .mapboxgl-popup-content {
        padding: 0;
        background: none;
        box-shadow: 0px 0px 20px 3px rgba(0,0,0,0.3)
    }
        
    // Fix mapboxgl popup arrow color for all possibles cases
    .mapboxgl-popup-anchor-top .mapboxgl-popup-tip,
    .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip,
    .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
        border-bottom-color: var(--primary);
    }
    .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
    .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip,
    .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
        border-top-color: var(--primary);
    }
    .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
        border-right-color: var(--primary);
    }
    .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
        border-left-color: var(--primary);
    }

    .bike-popup {
        color: var(--black);
        background: var(--primary);
        font-size: 14px;
        border-radius: 4px;
        min-width: 215px;

        .v-list {
            background: var(--primary);
            border-radius: 4px;
        }

        .v-list-item {
            padding: 0;
            margin-left: -5px;
        }

        .v-list-subheader {
            color: var(--secondary);
            font-size: 13px;
        }

        .v-list-item-title {
            color: var(--secondary);
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

    .popup-buttons {
        padding: 0 16px 16px 16px;
        display: flex;
    }

    .edit-bike-button {
        color: var(--primary);
        margin-right: 16px;
    }

</style>