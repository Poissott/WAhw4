<template>
  <div class="home">
    <p>Welcome to the Home Page!</p>
    <button v-if = "authResult" @click="Logout" class="center">Logout</button>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      authResult: false
    };
  },
  async mounted() {
    const auth = (await import('../server/auth.js')).default;
    this.authResult = await auth.authenticated();
  },
  methods: {
    Logout() {
      fetch("http://localhost:3000/auth/logout", {
        method: "POST",
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
