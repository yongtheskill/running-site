<template>
  <div class="relative size-36">
    <svg
      class="size-full"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg">
      <!-- Background Circle -->
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        class="stroke-current text-gray-200 dark:text-neutral-700"
        stroke-width="2"></circle>
      <!-- Progress Circle inside a group with rotation -->
      <g class="origin-center -rotate-90 transform">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          class="stroke-current text-blue-600 dark:text-blue-500"
          stroke-width="2"
          :stroke-dasharray="parseInt(progress) == 100 ? 0 : 100"
          :stroke-dashoffset="100 - parseFloat(progress)"></circle>
      </g>
    </svg>
    <!-- Percentage Text -->
    <div class="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2 pb-1">
      <span class="text-center text-2xl font-bold text-gray-800 dark:text-white">
        {{ parseFloat(progress).toFixed(2) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: progress } = await useFetch('/api/completion', { params: { user: 1 } });
</script>
