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
          <h4 class="w-100 mb-3 text-center">Join us and learn.</h4>
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
          <h5 class="mt-2 text-danger">{{ this.message }}</h5>
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

<script>
import animJson from "../assets/svg/travelAnim.json";
import { get, post } from "@/services/quickFetch";

export default {
  data() {
    return {
      mailInput: "",
      usernameInput: "",
      passwordInput: "",
      passwordRepeatInput: "",
      message: "",
      state: "mail",
      animJson,
    };
  },
  async mounted() {
    window.addEventListener("keydown", this.handleEnter);
    let res = await get("/api/auth/logged_in");
    if (res.status == 200) {
      this.$router.push("/lang");
    }
  },
  unmounted() {
    window.removeEventListener("keydown", this.handleEnter);
  },
  methods: {
    handleEnter(event) {
      if (event.key === "Enter") this.continueButton();
    },
    async continueButton() {
      if (this.state == "mail") {
        let userExists = await this.checkUserExists();
        if (userExists) {
          this.state = "login";
          return;
        } else {
          this.state = "register";
          return;
        }
      }
      if (this.state == "login") {
        await this.login();
      }
      if (this.state == "register") {
        await this.register();
      }
    },
    async checkUserExists() {
      let result = await post("/api/auth/user_exists", {
        mail: this.mailInput,
      });
      if (result.status == 200) {
        return result.body.exists;
      }
      return false;
    },
    async login() {
      this.message = "";
      let res = await post("/api/auth/login", {
        mail: this.mailInput,
        password: this.passwordInput,
      });
      if (res.status == 200) {
        this.$router.push("/lang");
      } else if (res.body.message) {
        this.message = res.body.message;
      }
    },
    async register() {
      this.message = "";

      if (this.passwordInput != this.passwordRepeatInput) {
        this.message = "Password mismatch.";
        return;
      }

      let res = await post("/api/auth/register", {
        username: this.usernameInput,
        mail: this.mailInput,
        password: this.passwordInput,
      });
      if (res.status == 200) {
        this.$router.push("/lang");
      } else if (res.body.message) {
        this.message = res.body.message;
      }
    },
    resetState() {
      this.state = "mail";
      this.message = "";
    },
  },
  computed: {
    getContinueButtonText: (state) => {
      switch (state.state) {
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
    },
    continueButtonBlocked: (state) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(state.mailInput)) {
        return true;
      }

      if (state.state == "login" || state.state == "register") {
        if (!state.passwordInput) {
          return true;
        }
        if (state.passwordInput.length < 6) {
          return true;
        }
      }

      if (state.state == "register") {
        if (!state.usernameInput || !state.passwordRepeatInput) {
          return true;
        }
        if (
          state.usernameInput.length < 6 ||
          state.passwordRepeatInput.length < 6
        ) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>
