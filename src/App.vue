<script setup lang="ts">
import { RouterView } from 'vue-router'
import { type GlobalTheme, darkTheme, NConfigProvider } from 'naive-ui'
import { ref } from 'vue'
const theme = ref<GlobalTheme | null>(darkTheme)
</script>

<template>
  <Suspense>
    <n-config-provider :theme="theme">
      <RouterView />
    </n-config-provider>
  </Suspense>
</template>
