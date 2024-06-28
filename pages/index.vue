<template>
  <div class="w-full h-full">
    <ClientOnly>
      <Map />
      <template #fallback> Loading map... </template>
    </ClientOnly>
  </div>
</template>
