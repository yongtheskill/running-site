<template>
  <div class="flex h-full">
    <div class="py-4 pr-4 w-96">
      <div class="bg-gray-900 rounded-2xl h-full overflow-hidden overflow-y-auto relative">
        <div class="py-5 px-5">
          <h1 class="text-2xl font-bold pb-2 px-4">My Runs</h1>
          <div
            v-for="run in data"
            :key="run.id"
            class="py-4 flex justify-between items-center border-b border-gray-800 hover:bg-gray-700 px-4 cursor-pointer transition-all"
            :class="{ 'bg-gray-800': selectedRun == run.id }"
            @click="selectedRun = run.id">
            <div class="flex justify-between items-center flex-grow">
              <div>
                <h2 class="text-base font-semibold">
                  {{ DateTime.fromISO(run.ran_at).toLocaleString(DateTime.DATE_SHORT) }}
                </h2>
                <h3 class="text-sm font-normal text-gray-400">
                  {{
                    DateTime.fromISO(run.ran_at).toLocaleString(DateTime.TIME_SIMPLE, {
                      locale: 'en-US',
                    })
                  }}
                </h3>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-400">
                  {{ formatDistance(parseFloat(run.distance)) }}
                </div>
                <div class="text-sm text-gray-400">
                  {{ formatDuration(run.duration) }}
                </div>
              </div>
            </div>

            <span class="material-symbols-outlined pl-3"> chevron_right </span>
          </div>
        </div>
      </div>
    </div>
    <div class="py-4 pr-4 flex-1">
      <div class="bg-gray-900 rounded-2xl h-full overflow-hidden relative">
        <RunDisplay :run-id="selectedRun" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
const authState = useAuthState();

const { data } = await useFetch<
  {
    id: number;
    ran_at: string;
    distance: string;
    duration: number;
  }[]
>('/api/myRuns', {
  headers: authState.value != null ? { Authorization: authState.value.session } : {},
});

const selectedRun = ref<null | number>(null);
</script>
