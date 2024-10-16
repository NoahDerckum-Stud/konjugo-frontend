import { createRouter, createWebHistory } from "vue-router";
import WelcomePage from "../views/LoginView.vue";
import SelectLangPage from "../views/LanguageSelection.vue";
import DashboardView from "../views/MenuView.vue";
import InitTrainView from "../views/InitTrainView.vue";
import TrainView from "../views/TrainView.vue";
import StatisticsView from "@/views/StatisticsView.vue";
import StorySelectionView from "../views/StorySelectionView.vue";
import NewStoryView from "@/views/NewStoryView.vue";
import TrainStoryView from "../views/TrainStoryView.vue";
import ProfileView from "@/views/ProfileView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "welcome",
      component: WelcomePage,
    },
    {
      path: "/lang",
      name: "lang",
      component: SelectLangPage,
    },
    {
      path: "/dash",
      name: "dash",
      component: DashboardView,
    },
    {
      path: "/starttrain",
      name: "starttrain",
      component: InitTrainView,
    },
    {
      path: "/train",
      name: "train",
      component: TrainView,
    },
    {
      path: "/statistics",
      name: "statistics",
      component: StatisticsView,
    },
    {
      path: "/storylib",
      name: "storylib",
      component: StorySelectionView,
    },
    {
      path: "/newstory",
      name: "newstory",
      component: NewStoryView,
    },
    {
      path: "/trainstory",
      name: "trainstory",
      component: TrainStoryView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
  ],
});

export default router;
