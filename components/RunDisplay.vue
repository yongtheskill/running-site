<template>
  <div v-if="runId == null" class="w-full h-full flex items-center justify-center">
    <h1 class="font-bold">Select a run!</h1>
  </div>

  <div v-else-if="data == null" class="w-full h-full flex items-center justify-center">
    <h1 class="font-bold">Loading run data...</h1>
  </div>

  <div v-else class="w-full h-full">
    <div class="relative w-full h-[50%]">
      <ClientOnly>
        <Map :run-data="runData" />
        <template #fallback> Loading map... </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
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
    }),
  {
    watch: [() => props.runId],
  }
);
</script>
