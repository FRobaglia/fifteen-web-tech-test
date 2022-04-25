<template>
    <button @click="$emit('toggleTheme')" class="theme-toggle">
        <v-icon size="30">
            mdi-brightness-6
        </v-icon>
    </button>
</template>

<style scoped lang="scss">

.theme-toggle {
    position: absolute;
    top: 35px;
    right: 35px;
    z-index: 20;
    color: var(--secondary);
    transform: rotate(0);
    transition: .1s ease;

    &:hover {
        transform: scale(1.15);
    }
}
</style>