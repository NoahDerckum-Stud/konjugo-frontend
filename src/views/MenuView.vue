<script setup>
import MenuCard from "@/components/MenuCard.vue";
import NavigationBar from "@/components/NavigationBar.vue";

import todoAnim from "../assets/svg/todoAnim.json";
import bookAnim from "../assets/svg/bookAnim.json";
import graphAnim from "../assets/svg/graphAnim.json";
import profileAnim from "../assets/svg/profileAnim.json";
</script>

<template>
  <div class="container">
    <NavigationBar></NavigationBar>
    <div class="row mt-0 mt-xl-5">
      <div class="col-md-12 mt-4">
        <div
          class="d-flex flex-wrap justify-content-center justify-content-xl-around"
        >
          <MenuCard
            :anim="todoAnim"
            :header="'Training'"
            :description="'Train your skills'"
            @click="$router.push('/starttrain')"
          />
          <MenuCard
            :anim="bookAnim"
            :header="'Literature'"
            :description="'Practice with texts'"
            @click="$router.push('/storylib')"
          />
          <MenuCard
            :anim="graphAnim"
            :header="'Stats'"
            :description="'Check your progress'"
            @click="$router.push('/statistics')"
          />
          <MenuCard
            :anim="profileAnim"
            :header="'Profile'"
            :description="'All about you'"
            @click="$router.push('/profile')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
