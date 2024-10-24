<script setup>
import animJson from "../assets/svg/travelAnim.json";
import { get, post } from "@/services/quickFetch";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

const mailInput = ref("");
const usernameInput = ref("");
const passwordInput = ref("");
const passwordRepeatInput = ref("");
const message = ref("");
const state = ref("mail");

const router = useRouter();

onMounted(async () => {
  window.addEventListener("keydown", handleEnter);
  let res = await get("/api/auth/logged_in");
  if (res.status == 200) {
    router.push("/lang");
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEnter);
});

function handleEnter(event) {
  if (event.key === "Enter") continueButton();
}

async function continueButton() {
  if (continueButtonBlocked.value) return;

  if (state.value == "mail") {
    let userExists = await checkUserExists();
    if (userExists) {
      state.value = "login";
      return;
    } else {
      state.value = "register";
      return;
    }
  }
  if (state.value == "login") {
    await login();
  }
  if (state.value == "register") {
    await register();
  }
}

async function checkUserExists() {
  let result = await post("/api/auth/user_exists", {
    mail: mailInput.value,
  });
  if (result.status == 200) {
    return result.body.exists;
  }
  return false;
}

async function login() {
  message.value = "";
  let res = await post("/api/auth/login", {
    mail: mailInput.value,
    password: passwordInput.value,
  });
  if (res.status == 200) {
    router.push("/lang");
  } else if (res.body.message) {
    message.value = res.body.message;
  }
}

async function register() {
  message.value = "";

  if (passwordInput.value != passwordRepeatInput.value) {
    message.value = "Password mismatch.";
    return;
  }

  let res = await post("/api/auth/register", {
    username: usernameInput.value,
    mail: mailInput.value,
    password: passwordInput.value,
  });
  if (res.status == 200) {
    router.push("/lang");
  } else if (res.body.message) {
    message.value = res.body.message;
  }
}

function resetState() {
  state.value = "mail";
  message.value = "";
}

const getContinueButtonText = computed(() => {
  switch (state.value) {
    case "mail":
      return "Continue";
      break;
    case "login":
      return "Login";
      break;
    case "register":
      return "Register";
      break;
  }
  return "Continue";
});

const continueButtonBlocked = computed(() => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(mailInput.value)) {
    return true;
  }

  if (state.value == "login" || state.value == "register") {
    if (!passwordInput.value) {
      return true;
    }
    if (passwordInput.value.length < 6) {
      return true;
    }
  }

  if (state.value == "register") {
    if (!usernameInput.value || !passwordRepeatInput.value) {
      return true;
    }
    if (
      usernameInput.value.length < 6 ||
      passwordRepeatInput.value.length < 6
    ) {
      return true;
    }
  }
  return false;
});

const dynamicSubtitle = computed(() => {
  if (state.value == "mail") return "Please enter your mail.";
  if (state.value == "login") return "Log into your account.";
  if (state.value == "register") return "Register a new account";
});
</script>

<template>
  <div class="wrapper w-100 overflow-hidden">
    <div class="left">
      <div class="vertical-center-logo">
        <Vue3Lottie :animationData="animJson" width="75%" :speed="0.5" />
      </div>
    </div>

    <div class="right vertical-center">
      <div class="row d-flex justify-content-center">
        <div class="d-flex flex-column w-50">
          <h1 class="display-6 w-100 text-center">Konjugo</h1>
          <h4 class="w-100 mb-3 mt-2 text-center">Join us and learn.</h4>
          <h5 class="w-100 mb-3 mt-2 text-center">{{ dynamicSubtitle }}</h5>
          <input
            v-model="mailInput"
            type="email"
            class="form-control mt-2"
            placeholder="Mail"
            :disabled="state != 'mail'"
          />
          <input
            v-if="state == 'register'"
            v-model="usernameInput"
            type="text"
            class="form-control mt-2"
            placeholder="Username"
          />
          <input
            v-if="state == 'login' || state == 'register'"
            v-model="passwordInput"
            type="password"
            class="form-control mt-2"
            placeholder="Password"
          />
          <input
            v-if="state == 'register'"
            v-model="passwordRepeatInput"
            type="password"
            class="form-control mt-2"
            placeholder="Password Repeat"
          />
          <h5 class="mt-2 text-danger">{{ message }}</h5>
          <div class="d-flex justify-content-evenly">
            <button
              v-if="state != 'mail'"
              @click="() => resetState()"
              class="btn btn-secondary w-100 mx-auto px-5 mt-3"
            >
              Back
            </button>
            <button
              @click="() => continueButton()"
              :disabled="continueButtonBlocked"
              class="btn btn-danger w-100 mx-auto px-5 mt-3"
            >
              {{ getContinueButtonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn,
.form-control,
.form-label {
  font-size: 1.25rem;
}

.vertical-center-logo {
  margin: 0;
  position: relative;
  top: 45%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.vertical-center {
  position: relative;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.left {
  width: 40%;
  float: left;
  background-color: rgb(255, 0, 0);
  animation: color-change 6s infinite;
  height: 100%;
}

@keyframes color-change {
  0% {
    background-color: rgb(133, 0, 138); /* Rot */
  }
  33% {
    background-color: rgb(85, 0, 122); /* Grün */
  }
  66% {
    background-color: rgb(0, 0, 133); /* Blau */
  }
  100% {
    background-color: rgb(133, 0, 138); /* Zurück zu Rot */
  }
}

.right {
  width: 60%;
  float: right;
}
</style>
