<template>
    <button @click="$emit('toggleTheme')" class="theme-toggle">
        <v-icon class="theme-icon" size="30">
            mdi-brightness-6
        </v-icon>
    </button>
</template>

<style scoped lang="scss">

.theme-toggle {
    position: absolute;
    top: 35px;
    right: 35px;
    z-index: 5;
    color: var(--secondary);
}
</style>