<script setup>
import NavigationBar from "@/components/NavigationBar.vue";
import { get, del, put, post } from "@/services/quickFetch";
import { useSettingsStore } from "@/stores/settingsStore";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const settingsStore = useSettingsStore();

const usernameInput = ref("");
const tmpUsernameInput = ref("");
const mailInput = ref("");
const tmpMailInput = ref("");
const passwordInput = ref("");
const passwordRepeatInput = ref("");
const nativeTitles = ref(false);
const overallMessage = ref("");
const passwordErrorMessage = ref("");
const passwordSuccessMessage = ref("");
const router = useRouter();

onMounted(async () => {
  let profile = await get("/api/profile/profile_info");
  usernameInput.value = profile.body.username;
  tmpUsernameInput.value = profile.body.username;
  mailInput.value = profile.body.mail;
  tmpMailInput.value = profile.body.mail;
});

async function updateUsername() {
  let res = await put("/api/profile/username", {
    username: usernameInput.value,
  });
  if (res.status == 200) {
    tmpUsernameInput.value = usernameInput.value;
    overallMessage.value = "";
  } else {
    overallMessage.value = res?.body.message;
  }
}

async function updateMail() {
  let res = await put("/api/profile/mail", {
    mail: mailInput.value,
  });
  if (res.status == 200) {
    tmpMailInput.value = mailInput.value;
    overallMessage.value = "";
  } else {
    overallMessage.value = res?.body.message;
  }
}

async function updatePassword() {
  let res = await put("/api/profile/password", {
    password: passwordInput.value,
  });
  if (res.status == 200) {
    passwordErrorMessage.value = "";
    passwordSuccessMessage.value = "Password updated";
    passwordInput.value = "";
    passwordRepeatInput.value = "";
  } else {
    passwordErrorMessage.value = res?.body.message;
    passwordSuccessMessage.value = "";
  }
}

async function deleteProfile() {
  let res = await del("/api/profile/user");
  if (res.status == 200) {
    router.push("/");
  }
}

async function logout() {
  let res = await post("/api/auth/logout");
  if (res.status == 200) {
    router.push("/");
  }
}
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
          <hr />
          <p class="text-muted">Konjugo, made by Noah Derckum - 1.0.0</p>
        </div>
      </div>
    </div>
  </div>
</template>
