<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import StoryCard from "@/components/StoryCard.vue";
import { post } from "@/services/quickFetch";
import { useSettingsStore } from "@/stores/settingsStore";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const dashboard = ref(undefined);
const router = useRouter();

onMounted(async () => {
  const settingsStore = useSettingsStore();
  let result = await post("/api/stories/get_story_dash", {
    langiso: settingsStore.selectedLanguage.langiso,
  });
  if (result.status == 200) {
    dashboard.value = result.body;
  }
});

function cardClicked(id) {
  router.push({ path: "/trainstory", query: { id } });
}

async function likeClicked(story) {
  if (story.liked) {
    setLikeStory(story._id, false);
  } else {
    setLikeStory(story._id, true);
  }
  await post("/api/stories/set_story_like", {
    id: story._id,
    state: story.liked,
  });
}

function setLikeStory(id, state) {
  for (let story of dashboard.value.userStories) {
    if (story._id == id) {
      story.likeCount += state ? 1 : -1;
      story.liked = state;
    }
  }
  for (let story of dashboard.value.popularStories) {
    if (story._id == id) {
      story.likeCount += state ? 1 : -1;
      story.liked = state;
    }
  }
  for (let story of dashboard.value.recentStories) {
    if (story._id == id) {
      story.likeCount += state ? 1 : -1;
      story.liked = state;
    }
  }
}
</script>

<template>
  <div class="container">
    <NavigationBar></NavigationBar>

    <div class="row">
      <h2 class="mb-2">My Stories</h2>

      <div class="d-flex flex-wrap">
        <div
          class="card hover-anim me-3 mt-2"
          style="width: 12rem; height: 12rem"
          v-on:click="() => $router.push('/newstory')"
        >
          <div class="card-body">
            <h5 class="card-title text-center">New Story</h5>
            <h6 class="card-subtitle mb-2 text-muted"></h6>
            <p class="card-text text-center" style="font-size: 5rem">+</p>
          </div>
        </div>
        <StoryCard
          v-for="story in dashboard?.userStories"
          :story="story"
          @card-clicked="cardClicked"
          @like-clicked="likeClicked"
        />
      </div>
    </div>
    <hr />
    <div class="row">
      <h2 class="mb-2">Popular Stories</h2>
      <div class="d-flex flex-wrap">
        <StoryCard
          v-for="story in dashboard?.popularStories"
          :story="story"
          @card-clicked="cardClicked"
          @like-clicked="likeClicked"
        />
      </div>
    </div>
    <hr />
    <div class="row">
      <h2 class="mb-2">Recent Stories</h2>
      <div class="d-flex flex-wrap">
        <StoryCard
          v-for="story in dashboard?.recentStories"
          :story="story"
          @card-clicked="cardClicked"
          @like-clicked="likeClicked"
        />
      </div>
    </div>
  </div>
</template>
