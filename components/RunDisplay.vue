<template>
  <div v-if="runId == null" class="w-full h-full flex items-center justify-center">
    <h1 class="font-bold">Select a run!</h1>
  </div>

  <div v-else-if="data == null" class="w-full h-full flex items-center justify-center">
    <h1 class="font-bold">Loading run data...</h1>
  </div>

  <div v-else class="w-full h-full flex flex-col">
    <div class="relative w-full flex-grow">
      <ClientOnly>
        <Map :run-data="runData" />
        <template #fallback> Loading map... </template>
      </ClientOnly>
    </div>
    <div class="w-full px-9 pt-6 pb-8">
      <h1 class="text-4xl font-black">
        {{ DateTime.fromISO(data.ran_at).toLocaleString(DateTime.DATE_SHORT) }}
      </h1>
      <h2 class="text-base font-normal text-gray-400">
        {{
          DateTime.fromISO(data.ran_at).toLocaleString(DateTime.TIME_SIMPLE, {
            locale: 'en-US',
          })
        }}
      </h2>
      <div class="w-full border-b border-gray-700 pt-4"></div>
      <div class="grid grid-flow-row grid-cols-2">
        <div class="pt-6">
          <h2 class="text-sm">Duration</h2>
          <div class="text-2xl font-bold">{{ formatFullDuration(data.duration) }}</div>
        </div>
        <div class="pt-6">
          <h2 class="text-sm">Avg. Pace</h2>
          <div class="text-2xl font-bold">{{ formatSpeed(parseFloat(data.avg_speed)) }}</div>
        </div>
        <div class="pt-6">
          <h2 class="text-sm">Elevation Gain</h2>
          <div class="text-2xl font-bold">
            {{ formatDistance(parseFloat(data.elevation_gain)) }}
          </div>
        </div>
        <div class="pt-6">
          <h2 class="text-sm">Distance</h2>
          <div class="text-2xl font-bold">{{ formatDistance(parseFloat(data.distance)) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';

const props = defineProps<{
  runId: number | null;
}>();

const runData = computed(() => {
  if (props.runId == null || data.value == null || typeof data.value !== 'object') return undefined;
  return {
    runId: props.runId,
    bbox: data.value.bbox,
  };
});

const authState = useAuthState();

const { data } = await useAsyncData<{
  id: number;
  ran_at: string;
  distance: string;
  duration: number;
  avg_speed: string;
  elevation_gain: string;
  bbox: [number, number, number, number];
}>(
  'run',
  () =>
    $fetch('/api/run', {
      params: { run: props.runId },
      headers: authState.value != null ? { Authorization: authState.value.session } : {},
    }),
  {
    watch: [() => props.runId],
  }
);
</script>
