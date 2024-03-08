<script lang="ts" setup>
import { NH1 } from 'naive-ui'

defineProps<{ title: string }>()
</script>

<template>
  <div class="ha-template">
    <n-h1>{{ title }}</n-h1>
    <div class="ha-template__content">
      <slot></slot>
    </div>

    <slot name="footer"></slot>
  </div>
</template>

<style lang="scss">
.ha-template {
  display: grid;
  justify-content: center;
  min-height: 100vh;

  &__content {
    display: grid;
  }
}
</style>
