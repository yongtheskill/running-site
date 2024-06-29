<template>
  <div class="py-4 pr-4 h-full">
    <div class="bg-gray-900 rounded-2xl h-full overflow-hidden relative">
      <ClientOnly>
        <Map />
        <template #fallback> Loading map... </template>
      </ClientOnly>
    </div>
  </div>
</template>
