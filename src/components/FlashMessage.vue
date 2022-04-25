<template>
    <div class="flash-message">
        {{ props.message }}
    </div>
</template>

<script setup lang="ts">
export interface flashMessageProps {
  message: string;
}

const props = defineProps<flashMessageProps>();
</script>

<style scoped lang="scss">

.flash-message {
    position: absolute;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    background: var(--white);
    color: var(--black);
    transition: top .3s;
    border-radius: 5px;
    box-shadow: 0 3px 3px rgba(0,0,0,0.4);
    padding: 12px;
    text-align: center;
    width: 80%;
    max-width: 380px;

    &.active {
        top: 30px;
    }
}
</style>