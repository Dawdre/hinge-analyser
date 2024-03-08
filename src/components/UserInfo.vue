<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { NSkeleton, NButton } from 'naive-ui'
import { UseImage } from '@vueuse/components'

const store = useUserStore()
</script>

<template>
  <div v-if="store.isUserLoggedIn" class="ha-user-info">
    <div>
      <UseImage
        class="ha-user-info__profile-picture"
        :src="store.userDetails?.picture"
        referrerPolicy="no-referrer"
      >
        <template #loading>
          <n-skeleton :sharp="false" :height="50" />
        </template>

        <template #error> error </template>
      </UseImage>
    </div>
    <div>
      {{ store.userDetails?.name }}
    </div>
    <div>
      <n-button type="primary" @click="store.signOut">Sign Out</n-button>
    </div>
  </div>
</template>

<style lang="scss">
.ha-user-info {
  display: flex;
  align-self: flex-end;
  position: sticky;
  bottom: 0;
  color: white;
  justify-content: space-between;
  align-items: center;

  &__profile-picture {
    border-radius: 50%;
    border: 2px solid white;
    width: 50px;
    height: auto;
  }
}
</style>
