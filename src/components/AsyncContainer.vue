<template>
  <template v-if="asyncValue">
    <slot />
  </template>
  <template v-if="!asyncValue">
    <div class="d-flex justify-content-center mt-5">
      <div class="spinner-grow" style="width: 3rem; height: 3rem" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </template>
</template>

<script>
export default {
  props: ["asyncValue"],
};
</script>
