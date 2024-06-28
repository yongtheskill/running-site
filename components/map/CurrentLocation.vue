<template>
  <ol-vector-layer :zIndex="10" v-if="currentLocation != null">
    <ol-source-vector>
      <ol-feature>
        <ol-geom-point :coordinates="currentLocation"></ol-geom-point>
        <ol-style>
          <ol-style-circle :radius="12">
            <ol-style-fill color="#4285f450"></ol-style-fill>
            <ol-style-stroke :width="0"></ol-style-stroke>
          </ol-style-circle>
        </ol-style>
      </ol-feature>
      <ol-feature>
        <ol-geom-point :coordinates="currentLocation"></ol-geom-point>
        <ol-style>
          <ol-style-circle :radius="7">
            <ol-style-fill color="#4285f4"></ol-style-fill>
            <ol-style-stroke color="#ffffff" :width="2"></ol-style-stroke>
          </ol-style-circle>
        </ol-style>
      </ol-feature>
    </ol-source-vector>
  </ol-vector-layer>
</template>

<script setup lang="ts">
defineProps<{ currentLocation: [number, number] | null }>();
</script>
