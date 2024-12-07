<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

import { NUpload, NUploadDragger, NH2, NButton, NSkeleton } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import GoogleLoginButton from '@/components/GoogleLoginButton.vue'
import { useApi } from '@/composables/useApi'
import HATemplate from '@/templates/HATemplate.vue'
import UserInfo from '@/components/UserInfo.vue'
import HACard from '@/components/HACard.vue'
import HAPerson from '@/components/HAPerson.vue'
import type { Person } from '@/types/api'
import type { PersonsWithPagination } from '@/types/util'

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

const personsUrl = ref('/api/v1/persons?page=40')

const {
  data: stats,
  execute: fetchStats,
  isFetching: isLoadingStats
} = useApi<Stats>('/api/v1/stats', { immediate: false }).get()

const {
  data: persons,
  execute: fetchPersons,
  isFetching: isLoadingPersons
} = useApi<PersonsWithPagination>(
  personsUrl,
  { immediate: false, refetch: true }).get()

await fetchStats()
await fetchPersons()

const fileUploadHeaderFunction = () => ({
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
})

const fileUploadFinishFunction = (file: any) => {
  fetchStats()
  fetchPersons()
  console.log('finished', file)
}

const deleteEverything = () => {
  useApi<void>('/api/v1/delete-all').delete()

  stats.value = null
}

const changePage = (page: number) => {
  personsUrl.value = `/api/v1/persons?page=${page}`
}

const cardMatches = computed(() => {
  if (stats.value) {
    return [
      {
        label: 'Total Matches',
        value: stats.value.matches.total_match_count
      },
      {
        label: 'They Liked and Matched',
        value: stats.value.matches.they_liked_matched_count
      },
      {
        label: 'I Liked and Matched',
        value: stats.value.matches.i_liked_matched_count
      },
      {
        label: 'Matches Per Day',
        value: stats.value.matches.matches_per_day_for_given_range.matches
      },
      {
        label: 'Conversion rate',
        value: `${stats.value.conversion_percentage.percentage}%`
      }
    ]
  }
  return []
})

const cardLikes = computed(() => {
  if (stats.value) {
    return [
      {
        label: 'Likes sent',
        value: stats.value.likes.total_like_count
      },
      {
        label: 'Likes Received and Matched, Per Day',
        value: stats.value.likes.likes_received_per_day_for_given_range.likes
      }
    ]
  }
  return []
})

const rangeDate = computed(() => {
  if (stats.value) {
    const start_date = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(stats.value.event_date_range.start_date))

    const end_date = new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(stats.value.event_date_range.end_date))

    return `${start_date} to ${end_date}`
  }
  return ''
})

onMounted(() => {
  userStore.loadGoogleLoginLibrary()
})
</script>

<template>
  <h-a-template title="Hinge Analyser">
    <google-login-button
      v-if="!userStore.isUserLoggedIn && userStore.isGoogleLoginLibraryAvailable"
    />

    <template v-else>
      <n-upload
        class="ha-upload"
        action="http://localhost:8000/api/v1/upload"
        accept=".json"
        :headers="fileUploadHeaderFunction"
        :onFinish="fileUploadFinishFunction"
      >
        <n-upload-dragger> Upload your Hinge "matches.json" file here </n-upload-dragger>
      </n-upload>
      <n-h2 class="ha-stats__title">{{ rangeDate }}</n-h2>
      <h-a-card
        card-title="Matches"
        :card-data="cardMatches"
        :loading="isLoadingStats"
        :label-extractor="(cardMatches) => cardMatches.label"
        :value-extractor="(cardMatches) => cardMatches.value"
      />
      <h-a-card
        card-title="Likes"
        :card-data="cardLikes"
        :loading="isLoadingStats"
        :label-extractor="(cardLikes) => cardLikes.label"
        :value-extractor="(cardLikes) => cardLikes.value"
      />
    </template>
    <template #footer>
      <template v-if="!isLoadingPersons">
        <h-a-person v-if="persons" :sortedPersons="persons" @page-change="changePage"/>
      </template>
      <n-skeleton v-else :sharp="false" :height="200" />

      <n-button @click="deleteEverything">Delete everything</n-button>
      <user-info />
    </template>
  </h-a-template>
</template>

<style lang="scss">
.ha-upload {
  grid-column: 1 / -1;
}

.ha-stats__title {
  grid-column: 1 / -1;
}
</style>
