<template>
  <div class="card hover-anim me-3 mt-2" style="width: 12rem; height: 12rem">
    <div class="card-body" @click="$emit('card-clicked', story?._id)">
      <h5
        class="card-title text-center text-decoration-underline text-truncate"
      >
        {{ story?.title }}
      </h5>
      <h6 class="card-subtitle mb-2 text-muted"></h6>
      <p class="card-text text-center">{{ story?.description }}</p>
      <p class="card-text text-center text-muted">
        {{ story?.placeholderCount }} Flections
      </p>
    </div>
    <div class="card-footer text-center bg-transparent py-0">
      <button class="btn" @click="$emit('like-clicked', story)">
        <div class="d-flex">
          <p class="m-0 p-0 my-auto" style="font-size: 2rem; line-height: 1rem">
            {{ !story?.liked ? "♡" : "♥" }}
          </p>
          <p class="m-0 my-auto ms-2">
            {{ story?.likeCount }}
          </p>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["story"],
};
</script>
