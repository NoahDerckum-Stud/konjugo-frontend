<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import StoryCard from "@/components/StoryCard.vue";
import { post, del } from "@/services/quickFetch";
import { useSettingsStore } from "@/stores/settingsStore";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const dashboard = reactive({
  userStories: undefined,
  recentStories: undefined,
  popularStories: undefined,
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
}

onMounted(async () => {
  dashboard.userStories = await getStories("user", 0);
  dashboard.popularStories = await getStories("popular", 0);
  dashboard.recentStories = await getStories("recent", 0);
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
    for (let story of dashboard.userStories.stories) {
      if (story._id == storyId) {
        dashboard.userStories.stories.splice(
          dashboard.userStories.stories.indexOf(story),
          1
        );
      }
    }
    for (let story of dashboard.popularStories.stories) {
      if (story._id == storyId) {
        dashboard.popularStories.stories.splice(
          dashboard.popularStories.stories.indexOf(story),
          1
        );
      }
    }
    for (let story of dashboard.recentStories.stories) {
      if (story._id == storyId) {
        dashboard.recentStories.stories.splice(
          dashboard.recentStories.stories.indexOf(story),
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
  ];

  for (let story of allStories) {
    if (story._id == id) {
      story.likeCount += state ? 1 : -1;
      story.liked = state;
    }
  }
  return;
}
</script>

<template>
  <div class="container">
    <NavigationBar></NavigationBar>

    <div class="row">
      <div class="d-flex">
        <h2 class="mb-2">My Stories</h2>
        <div
          class="d-flex my-auto justify-content-center ms-3"
          v-if="dashboard.userStories?.pages != 0"
        >
          <button
            :disabled="dashboard.userStories?.page == 0"
            class="btn btn-outline-primary"
            @click="() => updateArea('user', dashboard.userStories?.page - 1)"
          >
            <
          </button>
          <h5 class="mx-3 my-auto">
            Page {{ dashboard.userStories?.page + 1 }} /
            {{ dashboard.userStories?.pages + 1 }}
          </h5>
          <button
            :disabled="
              dashboard.userStories?.page == dashboard.userStories?.pages
            "
            class="btn btn-outline-primary"
            @click="() => updateArea('user', dashboard.userStories?.page + 1)"
          >
            >
          </button>
        </div>
      </div>

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
          v-for="story in dashboard?.userStories?.stories"
          :story="story"
          @card-clicked="cardClicked"
          @like-clicked="likeClicked"
          @request-delete="requestDelete"
        />
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="d-flex">
        <h2 class="mb-2">Popular Stories</h2>
        <div
          class="d-flex my-auto justify-content-center ms-3"
          v-if="dashboard.popularStories?.pages != 0"
        >
          <button
            :disabled="dashboard.popularStories?.page == 0"
            class="btn btn-outline-primary"
            @click="
              () => updateArea('popular', dashboard.popularStories?.page - 1)
            "
          >
            <
          </button>
          <h5 class="mx-3 my-auto">
            Page {{ dashboard.popularStories?.page + 1 }} /
            {{ dashboard.popularStories?.pages + 1 }}
          </h5>
          <button
            :disabled="
              dashboard.popularStories?.page == dashboard.popularStories?.pages
            "
            class="btn btn-outline-primary"
            @click="
              () => updateArea('popular', dashboard.popularStories?.page + 1)
            "
          >
            >
          </button>
        </div>
      </div>
      <div class="d-flex flex-wrap">
        <StoryCard
          v-for="story in dashboard?.popularStories?.stories"
          :story="story"
          @card-clicked="cardClicked"
          @like-clicked="likeClicked"
        />
      </div>
    </div>
    <hr />
    <div class="row">
      <div class="d-flex">
        <h2 class="mb-2">Recent Stories</h2>
        <div
          class="d-flex my-auto justify-content-center ms-3"
          v-if="dashboard.recentStories?.pages != 0"
        >
          <button
            :disabled="dashboard.recentStories?.page == 0"
            class="btn btn-outline-primary"
            @click="
              () => updateArea('recent', dashboard.recentStories?.page - 1)
            "
          >
            <
          </button>
          <h5 class="mx-3 my-auto">
            Page {{ dashboard.recentStories?.page + 1 }} /
            {{ dashboard.recentStories?.pages + 1 }}
          </h5>
          <button
            :disabled="
              dashboard.recentStories?.page == dashboard.recentStories?.pages
            "
            class="btn btn-outline-primary"
            @click="
              () => updateArea('recent', dashboard.recentStories?.page + 1)
            "
          >
            >
          </button>
        </div>
      </div>
      <div class="d-flex flex-wrap">
        <StoryCard
          v-for="story in dashboard?.recentStories?.stories"
          :story="story"
          @card-clicked="cardClicked"
          @like-clicked="likeClicked"
        />
      </div>
    </div>
  </div>
</template>
