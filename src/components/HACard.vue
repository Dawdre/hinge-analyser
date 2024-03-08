<template>
  <n-card v-if="!loading" class="ha-card">
    <n-h2>{{ cardTitle }}</n-h2>
    <div class="ha-card__content">
      <div v-for="data in cardData" :key="labelExtractor(data)" class="ha-card__data">
        <dd class="ha-card__data-value">{{ valueExtractor(data) }}</dd>
        <dt class="ha-card__data-key">{{ labelExtractor(data) }}</dt>
      </div>
    </div>
  </n-card>
  <n-skeleton v-else height="60px" />
</template>

<script setup lang="ts" generic="T">
import { NCard, NH2, NSkeleton } from 'naive-ui'

defineProps<{
  loading: boolean
  cardTitle: string
  cardData: Array<T>
  labelExtractor: (cardData: T) => string
  valueExtractor: (cardData: T) => string
}>()
</script>

<style lang="scss">
.ha-card {
  &__data {
    display: flex;
    flex-wrap: wrap;

    &-value {
      flex: 1;
      font-weight: bold;
      font-size: 3rem;
    }
  }
}
</style>
