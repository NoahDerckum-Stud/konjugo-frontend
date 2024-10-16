<template>
  <div
    class="card mb-3 me-0 me-md-2 me-xl-0"
    style="border-radius: 25px !important; border-width: 5px"
  >
    <div class="card-body p-0">
      <div class="d-flex flex-column justify-content-center">
        <Vue3Lottie
          style="width: 19rem; max-height: 15rem"
          :animationData="anim"
        ></Vue3Lottie>
        <div class="d-flex flex-fill flex-column my-auto">
          <h1 class="text-center text-center">{{ header }}</h1>
          <h3 class="text-center mb-5">{{ description }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(["anim", "header", "description"]);
</script>

<style lang="scss" scoped>
.card {
  transition: all 0.2s;
  &:hover {
    translate: 0px -10px;
    border-color: white;
    cursor: pointer;
  }
}
</style>
