<template>
  <div class="title-bar">
    <img @dblclick="openAbout" src="@/assets/logo.png" style="-webkit-app-region: no-drag; user-drag: none;">
  </div>
</template>

<script>
export default {
    methods: {
        openAbout() {
            window.ipc.send('about');
        }
    }
}
</script>

<style>
.title-bar {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-app-region: drag;
}
</style>