<template>
  <div class="flex justify-around items-stretch text-white bg-gray-950 h-screen">
    <header class="w-60 h-full">
      <div class="p-4 h-full">
        <div class="bg-gray-900 p-3 rounded-2xl h-full flex flex-col justify-between items-center">
          <nav class="w-full">
            <NuxtLink to="/" class="w-full">
              <div
                class="h-10 flex items-center hover:bg-gray-800 rounded-lg px-3 py-2 transition-all duration-150">
                Map
              </div>
            </NuxtLink>
            <NuxtLink to="/runs" class="w-full">
              <div
                class="h-10 flex items-center hover:bg-gray-800 rounded-lg px-3 py-2 transition-all duration-150">
                Runs
              </div>
            </NuxtLink>
          </nav>
          <div class="pb-6">
            <ProgressIndicator />
          </div>
        </div>
      </div>
    </header>
    <main class="flex-grow">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
    },
  ],
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
