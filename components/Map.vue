<template>
  <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" class="w-full h-full">
    <ol-view
      :center="center"
      :rotation="rotation"
      :zoom="zoom"
      :projection="projection"
      ref="mapView" />
    <ol-tile-layer>
      <ol-source-xyz url="http://mt{0-3}.googleapis.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga" />
    </ol-tile-layer>

    <ol-heatmap-layer :maxZoom="14" :blur="40" :radius="30" :weight="getHeatmapWeight">
      <ol-source-vector :url="`/api/heatmap?user=${1}`" :format="GeoJSON" :projection="projection">
      </ol-source-vector>
    </ol-heatmap-layer>

    <ol-vector-layer :minZoom="14">
      <ol-source-vector
        :url="getRoadsUrl"
        :strategy="bbox"
        :format="GeoJSON"
        :projection="projection">
      </ol-source-vector>
      <ol-style :overrideStyleFunction="styleRoads"> </ol-style>
    </ol-vector-layer>

    <MapCurrentLocation :current-location="currentLocation" />
  </ol-map>
  <div class="absolute bottom-0 right-0 px-5 py-3">
    <button
      class="bg-white border-gray-300 border w-8 h-8 rounded-lg text-gray-700 flex items-center justify-center"
      @click="centralise">
      <span class="!text-[18px] material-symbols-outlined"> my_location </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { FeatureLike } from 'ol/Feature';
import { Stroke, type Style } from 'ol/style';
import type { View } from 'ol';
const mapView = ref<View>();

const userId = 1;

const currentLocation = ref<null | [number, number]>(null);
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = epsg4326to3875([longitude, latitude]);

    center.value = coords;
    currentLocation.value = coords;
  });
}

const centralise = () => {
  zoom.value = 16;
  rotation.value = 0;
  mapView.value?.setZoom(zoom.value);
  mapView.value?.setRotation(rotation.value);
  if (currentLocation.value != null) {
    center.value = currentLocation.value;
    mapView.value?.setCenter(center.value);
  }
};

const center = ref(epsg4326to3875([103.8, 1.3]));
const projection = ref('EPSG:3857'); // EPSG:4326 or 3857
const zoom = ref(16);
const rotation = ref(0);

const styleRoads = (feature: FeatureLike, style: Style) => {
  const visited = feature.get('visited');

  style.setStroke(
    new Stroke({
      color: visited ? '#22d3ee99' : '#dc262688',
      width: visited ? 1 : 2,
    })
  );
  return style;
};

const getHeatmapWeight = (feature: any) => {
  return parseInt(feature.get('count')) / 120;
};

const getRoadsUrl = (
  extent: [number, number, number, number],
  resolution: number,
  projection: any
) => {
  const url = `/api/roads?bbox=${extent.join(',')}&user=${userId}`;
  return url;
};

const strategy = inject('ol-loadingstrategy');
const bbox = strategy.bbox;
const format = inject('ol-format');
const GeoJSON = new format.GeoJSON();
</script>

<style scoped>
@import 'vue3-openlayers/dist/vue3-openlayers.css';
</style>
