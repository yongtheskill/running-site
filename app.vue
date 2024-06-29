<template>
  <div class="flex justify-around items-stretch text-white bg-gray-950 h-screen">
    <header class="w-72 h-full">
      <div class="p-4 h-full">
        <div class="bg-gray-900 p-3 rounded-2xl h-full flex flex-col justify-between items-center">
          <nav class="w-full text-xl">
            <h1 class="px-4 text-4xl font-black text-orange-300 pb-3">Run!</h1>
            <div v-for="page in pages" :key="page.to" class="w-full pb-2">
              <NuxtLink :to="page.to" class="w-full">
                <div
                  class="flex items-center hover:bg-gray-700 rounded-lg px-4 pt-1 pb-2 transition-all duration-150"
                  :class="{ 'bg-gray-800 font-bold': page.to == $route.path }">
                  {{ page.label }}
                </div>
              </NuxtLink>
            </div>
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
const authState = useAuthState();

const pages = computed(() => {
  const unauthPages = [
    { label: 'Map', to: '/' },
    { label: 'Log In', to: '/account' },
  ];
  const authPages = [
    { label: 'Map', to: '/' },
    { label: 'Runs', to: '/runs' },
    { label: 'Account', to: '/account' },
  ];
  if (authState.value == null) return unauthPages;
  return authPages;
});

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

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  border-radius: 100vh;
  background: #0c111c55;
}

::-webkit-scrollbar-thumb {
  background: #37415155;
  border-radius: 100vh;
}

::-webkit-scrollbar-thumb:hover {
  background: #374151;
}
</style>
