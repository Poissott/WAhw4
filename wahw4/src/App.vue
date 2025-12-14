<template>
  <div id="app">
    <AppHeader />
    <router-view />
    <AppFooter />
  </div>
</template>

<script>
import AppFooter from './components/Footer.vue';
import AppHeader from './components/Header.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  }
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#app {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>