<template>
  <div class="home">
    <h1>Welcome to the Home Page!</h1>

    <!-- Action Buttons -->
    <div v-if="authResult" class="buttons">
      <button @click="$router.push('/add-post')">Add Post</button>
      <button @click="deleteAllPosts">Delete All Posts</button>
      <button @click="Logout">Logout</button>
    </div>

    <!-- Posts List -->
    <div v-if="posts.length">
      <h2>All Posts</h2>
      <ul>
        <li v-for="post in posts" :key="post.id">
          <router-link :to="`/posts/${post.id}`">
            {{ post.body }} <small>({{ formatDate(post.date) }})</small>
          </router-link>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>No posts available.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      authResult: false,
      posts: []
    };
  },
  async mounted() {
    const authModule = (await import('../server/auth.js')).default;
    this.authResult = await authModule.authenticated();

    if (this.authResult) {
      this.fetchPosts();
    } else {
      this.$router.push('/login');
    }
  },
  methods: {
    async fetchPosts() {
      try {
        const res = await fetch("http://localhost:3000/api/posts", {
          credentials: 'include'
        });
        this.posts = await res.json();
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    },
    async deleteAllPosts() {
      if (!confirm("Are you sure you want to delete all posts?")) return;

      try {
        await fetch("http://localhost:3000/api/posts", {
          method: "DELETE",
          credentials: 'include'
        });
        this.posts = [];
      } catch (err) {
        console.error("Error deleting posts:", err);
      }
    },
    Logout() {
      fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: 'include'
      }).then(() => {
        this.authResult = false;
        this.$router.push('/login');
      }).catch(() => console.log("Error logging out"));
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    }
  }
};
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.buttons {
  margin-bottom: 20px;
}

.buttons button {
  margin-right: 10px;
  padding: 8px 15px;
  background-color: #004080;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.buttons button:hover {
  opacity: 0.9;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 10px;
  margin-bottom: 5px;
  background: #f5f5f5;
  border-radius: 4px;
}

li a {
  text-decoration: none;
  color: #333;
}

li a:hover {
  text-decoration: underline;
}
</style>
