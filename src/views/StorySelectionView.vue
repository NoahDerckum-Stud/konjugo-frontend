<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import StoryCard from "@/components/StoryCard.vue";
import { post, del } from "@/services/quickFetch";
import { useSettingsStore } from "@/stores/settingsStore";
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const dashboard = reactive({
  userStories: undefined,
  recentStories: undefined,
  popularStories: undefined,
  likedStories: undefined,
});
const router = useRouter();
const settingsStore = useSettingsStore();

async function getStories(area, page) {
  let result = await post("/api/stories/get_story_dash", {
    langiso: settingsStore.selectedLanguage.langiso,
    area: area,
    page: page,
  });
  return result.status == 200 ? result.body : [];
}

async function updateArea(area, page) {
  let newStories = await getStories(area, page);
  if (area == "user") dashboard.userStories = newStories;
  if (area == "popular") dashboard.popularStories = newStories;
  if (area == "recent") dashboard.recentStories = newStories;
  if (area == "liked") dashboard.likedStories = newStories;
}

onMounted(async () => {
  dashboard.userStories = await getStories("user", 0);
  dashboard.popularStories = await getStories("popular", 0);
  dashboard.recentStories = await getStories("recent", 0);
  dashboard.likedStories = await getStories("liked", 0);
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

async function requestDelete(storyRef) {
  let storyId = storyRef._id;

  let res = await del("/api/stories/story", {
    id: storyId,
  });

  if (res.status == 200) {
    for (let area in dashboard)
      for (let story of dashboard[area].stories) {
        if (story._id == storyId) {
          dashboard[area].stories.splice(
            dashboard[area].stories.indexOf(story),
            1
          );
        }
      }
  }
}

function setLikeStory(id, state) {
  let allStories = [
    ...dashboard.userStories.stories,
    ...dashboard.popularStories.stories,
    ...dashboard.recentStories.stories,
    ...dashboard.likedStories.stories,
  ];

  for (let story of allStories) {
    if (story._id == id) {
      story.likeCount += state ? 1 : -1;
      story.liked = state;
    }
  }
  return;
}

const getMeta = computed(() => (entry) => {
  switch (entry) {
    case dashboard.userStories:
      return { area: "user", header: "My Stories" };
      break;
    case dashboard.popularStories:
      return { area: "popular", header: "Popular Stories" };
      break;
    case dashboard.recentStories:
      return { area: "recent", header: "Recent Stories" };
      break;
    case dashboard.likedStories:
      return { area: "liked", header: "Liked Stories" };
      break;
  }
  return { area: "", header: "" };
});
</script>

<template>
  <div class="container">
    <NavigationBar></NavigationBar>

    <div class="mb-5">
      <div class="row" v-for="(value, key) in dashboard">
        <div class="d-flex">
          <h2 class="mb-2">{{ getMeta(value).header }}</h2>
          <div
            class="d-flex my-auto justify-content-center ms-3"
            v-if="value && value?.pages != 0"
          >
            <button
              :disabled="value?.page == 0"
              class="btn btn-outline-primary"
              @click="() => updateArea(getMeta(value).area, value?.page - 1)"
            >
              <
            </button>
            <h5 class="mx-3 my-auto">
              Page {{ value?.page + 1 }} /
              {{ value?.pages + 1 }}
            </h5>
            <button
              :disabled="value?.page == value?.pages"
              class="btn btn-outline-primary"
              @click="() => updateArea(getMeta(value).area, value?.page + 1)"
            >
              >
            </button>
          </div>
        </div>

        <div class="d-flex flex-wrap">
          <div
            v-if="getMeta(value).area == 'user'"
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
            v-for="story in value?.stories"
            :story="story"
            @card-clicked="cardClicked"
            @like-clicked="likeClicked"
            @request-delete="requestDelete"
          />
        </div>

        <hr v-if="key != 'likedStories'" class="mt-3 mx-2" />
      </div>
    </div>
  </div>
</template>
