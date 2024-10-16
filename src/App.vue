<template>
  <RouterView class="h-100" />
</template>

<style lang="scss">
$primary: #7289da;
$success: rgb(91, 178, 132);

@import "./assets/customBootstrap.scss";
@import "bootstrap";

hr {
  border-width: 3px;
}

label {
  font-size: 1.3rem;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0px;
}

.form-control {
  border-width: 3px;
  padding: 4px 10px;
  border-radius: 0px;
  font-size: 1.3rem;
}

.btn,
.card,
.form-control,
.input-group-text {
  border-width: 3px;
  box-shadow: 12px 12px 24px #00000057;
}

.card {
  border-radius: 0px !important;
}

.btn {
  border-width: 3px;
  padding: 4px 10px;
  border-radius: 0px;
}

.hover-anim {
  transition: all 0.2s;
  &:hover {
    border-color: white;
    translate: 5px;
    cursor: pointer;
  }
}
</style>
