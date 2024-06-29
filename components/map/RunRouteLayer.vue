<template>
  <ol-vector-layer>
    <ol-source-vector
      :url="getRouteUrl"
      :format="GeoJSON"
      projection="EPSG:3857"
      ref="sourceVectorRef">
    </ol-source-vector>
    <ol-style>
      <ol-style-stroke color="#1e40af" :width="5"></ol-style-stroke>
    </ol-style>
  </ol-vector-layer>
</template>

<script setup lang="ts">
import type VectorSource from 'ol/source/Vector';

const props = defineProps<{
  runId: number;
}>();

const sourceVectorRef = ref<{ source: VectorSource }>();

watch(
  () => props.runId,
  () => {
    sourceVectorRef.value?.source.refresh();
  }
);

const getRouteUrl = () => {
  return `/api/runRoute?run=${props.runId}`;
};

const format = inject('ol-format');
const GeoJSON = new format.GeoJSON();
</script>
