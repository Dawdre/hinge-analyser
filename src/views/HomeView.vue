<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

import { NUpload, NUploadDragger, NButton } from 'naive-ui'
import { onMounted } from 'vue'
import GoogleLoginButton from '@/components/GoogleLoginButton.vue'
import { useApi } from '@/composables/useApi'

const userStore = useUserStore()

const { data: matches, execute: fetchMatches } = useApi('/api/v1/matches', {
  immediate: false
}).get()

const { data: likes, execute: fetchLikes } = useApi('/api/v1/likes', {
  immediate: false
}).get()

const fileUploadHeaderFunction = (_: any) => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
})

onMounted(() => {
  userStore.loadGoogleLoginLibrary()
})
</script>

<template>
  <main>
    <google-login-button
      v-if="!userStore.isUserLoggedIn && userStore.isGoogleLoginLibraryAvailable"
    />

    <div v-else>
      <img :src="userStore.userDetails?.picture" alt="User's profile picture" />
      <n-upload
        action="http://localhost:8000/api/v1/upload"
        accept=".json"
        :headers="fileUploadHeaderFunction"
      >
        <n-upload-dragger> Click or drag a file to this area </n-upload-dragger>
      </n-upload>
      <n-button type="primary" @click="fetchMatches">Fetch Matches</n-button>
      <n-button type="primary" @click="fetchLikes">Fetch Likes</n-button>
      {{ matches }}<br />
      {{ likes }}
    </div>
  </main>
</template>

<style lang="scss"></style>
