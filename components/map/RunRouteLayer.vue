<template>
  <ol-vector-layer>
    <ol-source-vector
      :url="getRouteUrl"
      :loader="routeLoader"
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

const authState = useAuthState();

const routeLoader = (
  _extent: any,
  _resolution: any,
  _projection: any,
  success: (result: any) => void,
  failure: () => void
) => {
  $fetch('/api/runRoute', {
    params: { run: props.runId },
    headers: authState.value != null ? { Authorization: authState.value.session } : {},
  })
    .then((result) => {
      if (sourceVectorRef.value?.source == undefined) return;
      const features = sourceVectorRef.value.source.getFormat()?.readFeatures(result);
      if (features != undefined) sourceVectorRef.value?.source.addFeatures(features as any);
      success(features);
    })
    .catch((error) => {
      console.log('error getting run route', error);
      failure();
    });
};

const format = inject('ol-format');
const GeoJSON = new format.GeoJSON();
</script>
