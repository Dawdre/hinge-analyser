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

const { data: stats, execute: fetchStats } = useApi('/api/v1/stats', {
  immediate: false
}).get()

const fileUploadHeaderFunction = (_: any) => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
})

async function matchesAll() {
  await fetchMatches()
}
async function likesAll() {
  await fetchLikes()
}
async function statsAll() {
  await fetchStats()
}

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
      <n-button type="primary" @click="matchesAll">Fetch Matches</n-button>
      <n-button type="primary" @click="likesAll">Fetch Likes</n-button>
      <n-button type="primary" @click="statsAll">Fetch Stats</n-button>
      <div v-if="matches">
        <h2>Matches</h2>
        <pre>{{ matches }}</pre>
      </div>
      <div v-if="likes">
        <h2>Likes</h2>
        <pre>{{ likes }}</pre>
      </div>
      <div v-if="stats">
        <h2>Stats</h2>
        <pre>{{ stats }}</pre>
      </div>
    </div>
  </main>
</template>

<style lang="scss"></style>
