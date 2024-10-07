<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import { get, del, put, post } from "@/services/quickFetch";
import { useSettingsStore } from "@/stores/settingsStore";
const settingsStore = useSettingsStore();
</script>

<template>
  <div class="container">
    <NavigationBar></NavigationBar>

    <div class="row">
      <div class="col-12 col-lg-6 mx-auto">
        <div class="d-flex flex-column mt-2">
          <h2>Overall Info</h2>
          <div class="mt-2 d-flex">
            <div class="input-group">
              <span class="input-group-text">Username</span>
              <input v-model="usernameInput" type="text" class="form-control" />
            </div>
            <button
              class="btn btn-outline-primary"
              v-if="usernameInput != tmpUsernameInput"
              @click="() => updateUsername()"
            >
              Update
            </button>
          </div>
          <div class="mt-2 d-flex mb-2">
            <div class="input-group">
              <span class="input-group-text">Mail</span>
              <input v-model="mailInput" type="text" class="form-control" />
            </div>
            <button
              class="btn btn-outline-primary"
              v-if="mailInput != tmpMailInput"
              @click="() => updateMail()"
            >
              Update
            </button>
          </div>
          <h5 class="mb-2 text-danger" v-if="overallMessage">
            {{ overallMessage }}
          </h5>
          <button class="btn btn-outline-danger" @click="() => deleteProfile()">
            Delete Account
          </button>
          <hr />
          <h2>Password</h2>
          <div class="mt-2 d-flex">
            <div class="input-group">
              <span class="input-group-text">New Password</span>
              <input
                v-model="passwordInput"
                type="password"
                class="form-control"
              />
            </div>
          </div>
          <div class="mt-2 d-flex mb-2">
            <div class="input-group">
              <span class="input-group-text">Repeat</span>
              <input
                v-model="passwordRepeatInput"
                type="password"
                class="form-control"
              />
            </div>
          </div>
          <h5 class="mb-2 text-danger" v-if="passwordErrorMessage">
            {{ passwordErrorMessage }}
          </h5>
          <h5 class="mb-2 text-success" v-if="passwordSuccessMessage">
            {{ passwordSuccessMessage }}
          </h5>
          <button
            class="btn btn-outline-primary"
            @click="() => updatePassword()"
            :disabled="passwordInput != passwordRepeatInput || !passwordInput"
          >
            Update Password
          </button>
          <button class="btn btn-outline-warning mt-2" @click="() => logout()">
            Logout
          </button>
          <hr />
          <h2>Settings</h2>
          <div class="d-flex mt-2">
            <h3>Show native titles</h3>
            <div
              class="form-check form-switch ms-5 my-auto"
              style="scale: 1.75"
            >
              <input
                v-model="settingsStore.showNativeTitles"
                class="form-check-input"
                type="checkbox"
                role="switch"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usernameInput: "",
      tmpUsernameInput: "",
      mailInput: "",
      tmpMailInput: "",
      passwordInput: "",
      passwordRepeatInput: "",
      nativeTitles: false,
      overallMessage: "",
      passwordErrorMessage: "",
      passwordSuccessMessage: "",
    };
  },
  async mounted() {
    let profile = await get("/api/profile/profile_info");
    this.usernameInput = profile.body.username;
    this.tmpUsernameInput = profile.body.username;
    this.mailInput = profile.body.mail;
    this.tmpMailInput = profile.body.mail;
  },
  methods: {
    async updateUsername() {
      let res = await put("/api/profile/username", {
        username: this.usernameInput,
      });
      if (res.status == 200) {
        this.tmpUsernameInput = this.usernameInput;
        this.overallMessage = "";
      } else {
        this.overallMessage = res?.body.message;
      }
    },
    async updateMail() {
      let res = await put("/api/profile/mail", {
        mail: this.mailInput,
      });
      if (res.status == 200) {
        this.tmpMailInput = this.mailInput;
        this.overallMessage = "";
      } else {
        this.overallMessage = res?.body.message;
      }
    },
    async updatePassword() {
      let res = await put("/api/profile/password", {
        password: this.passwordInput,
      });
      if (res.status == 200) {
        this.passwordMessage = "";
        this.passwordSuccessMessage = "Password updated";
        this.passwordInput = "";
        this.passwordRepeatInput = "";
      } else {
        this.passwordErrorMessage = res?.body.message;
      }
    },
    async deleteProfile() {
      let res = await del("/api/profile/user");
      if (res.status == 200) {
        this.$router.push("/");
      }
    },
    async logout() {
      let res = await post("/api/auth/logout");
      if (res.status == 200) {
        this.$router.push("/");
      }
    },
  },
};
</script>
