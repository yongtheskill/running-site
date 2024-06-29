<template>
  <div class="py-4 pr-4 h-full">
    <div class="bg-gray-900 rounded-2xl h-full overflow-hidden relative">
      <div class="absolute top-2 right-2 z-50 bg-gray-800 opacity-95 p-5 pt-3 rounded-xl">
        <h1 class="font-semibold text-center pb-3">{{ data }}'s Map</h1>
        <ProgressIndicator :user-id="parseInt(route.params.uid.toString())" />
      </div>
      <ClientOnly>
        <Map :user-id="parseInt(route.params.uid.toString())" />
        <template #fallback> Loading map... </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const { data } = await useFetch<string>('/api/username', {
  params: { user: route.params.uid },
});
</script>
