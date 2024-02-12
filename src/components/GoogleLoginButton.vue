<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { onMounted } from 'vue'

const userStore = useUserStore()

onMounted(() => {
  userStore.showGoogleLoginButton('googleLoginButtonId')
})
</script>

<template>
  <div id="googleLoginButtonId"></div>
</template>
