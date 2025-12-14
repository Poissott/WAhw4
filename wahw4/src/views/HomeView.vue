<template>
  <div class="home">
    <p>Welcome to the Home Page!</p>
    <button v-if = "authResult" @click="Logout" class="center">Logout</button>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    Logout() {
      fetch("http://localhost:3000/auth/logout", {
        credentials: 'include'
      })
        .then((response) => response.json())
        .then(() => {
          console.log('jwt removed');
          location.assign("/");
        })
        .catch(() => {
          console.log("error logout");
        });
    }
  }
}
</script>
