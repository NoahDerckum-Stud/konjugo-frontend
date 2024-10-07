<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import StoryCard from "@/components/StoryCard.vue";
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

<script>
import { post } from "@/services/quickFetch";
import { useSettingsStore } from "@/stores/settingsStore";
export default {
  data() {
    return {
      dashboard: undefined,
    };
  },
  async mounted() {
    const settingsStore = useSettingsStore();
    let result = await post("/api/stories/get_story_dash", {
      langiso: settingsStore.selectedLanguage.langiso,
    });
    if (result.status == 200) {
      this.dashboard = result.body;
      console.log(this.dashboard);
    }
  },
  methods: {
    cardClicked(id) {
      this.$router.push({ path: "/trainstory", query: { id } });
    },
    async likeClicked(story) {
      if (story.liked) {
        this.setLikeStory(story._id, false);
      } else {
        this.setLikeStory(story._id, true);
      }
      await post("/api/stories/set_story_like", {
        id: story._id,
        state: story.liked,
      });
    },
    setLikeStory(id, state) {
      for (let story of this.dashboard.userStories) {
        if (story._id == id) {
          story.likeCount += state ? 1 : -1;
          story.liked = state;
        }
      }
      for (let story of this.dashboard.popularStories) {
        if (story._id == id) {
          story.likeCount += state ? 1 : -1;
          story.liked = state;
        }
      }
      for (let story of this.dashboard.recentStories) {
        if (story._id == id) {
          story.likeCount += state ? 1 : -1;
          story.liked = state;
        }
      }
    },
  },
};
</script>
