<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

import { NUpload, NUploadDragger, NButton } from 'naive-ui'
import { onMounted } from 'vue'
import GoogleLoginButton from '@/components/GoogleLoginButton.vue'
import { useApi } from '@/composables/useApi'
import HATemplate from '@/templates/HATemplate.vue'
import UserInfo from '@/components/UserInfo.vue'
import HACard from '@/components/HACard.vue'

const userStore = useUserStore()

// const { data: matches, execute: fetchMatches } = useApi('/api/v1/matches', {
//   immediate: false
// }).get()

// const { data: likes, execute: fetchLikes } = useApi('/api/v1/likes', {
//   immediate: false
// }).get()

interface Stats {
  matches: {
    total_match_count: number
    they_liked_matched_count: number
    i_liked_matched_count: number
    matches_per_day_for_given_range: {
      date_range: {
        start_date: string
        end_date: string
      }
      matches: number
    }
  }
  likes: {
    description: string
    total_like_count: number
    likes_received_per_day_for_given_range: {
      date_range: {
        start_date: string
        end_date: string
      }
      likes: number
    }
  }
  event_date_range: {
    start_date: string
    end_date: string
  }
  conversion_percentage: {
    percentage: number
    description: string
  }
}

const { data: stats, isFetching: isLoadingStats } = useApi<Stats>('/api/v1/stats').get()

const fileUploadHeaderFunction = (_: any) => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
})

// async function matchesAll() {
//   await fetchMatches()
// }
// async function likesAll() {
//   await fetchLikes()
// }

onMounted(() => {
  userStore.loadGoogleLoginLibrary()
})
</script>

<template>
  <h-a-template title="Hinge Analyser">
    <google-login-button
      v-if="!userStore.isUserLoggedIn && userStore.isGoogleLoginLibraryAvailable"
    />

    <div v-else>
      <n-upload
        action="http://localhost:8000/api/v1/upload"
        accept=".json"
        :headers="fileUploadHeaderFunction"
      >
        <n-upload-dragger> Click or drag a file to this area </n-upload-dragger>
      </n-upload>
    </div>
    <template #footer>
      <user-info />
    </template>
  </h-a-template>
</template>

<style lang="scss"></style>
