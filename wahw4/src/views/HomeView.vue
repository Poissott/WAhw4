<template>
  <div class="home">
    <p>Welcome to the Home Page!</p>
   <!-- Action buttons -->
    <div v-if="authResult" class="buttons">
      <button @click="$router.push('/add-post')">Add Post</button>
      <button @click="deleteAllPosts">Delete All Posts</button>
      <button @click="Logout">Logout</button>
    </div>

    <!-- Posts List -->
    <div v-if="posts.length > 0" class="posts-list">
      <h2>All Posts</h2>
      <ul>
        <li v-for="post in posts" :key="post.id">
          <router-link :to="`/post/${post.id}`">
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
    const auth = (await import('../server/auth.js')).default;
    this.authResult = await auth.authenticated();

    if (this.authResult) {
      this.fetchPosts();
    }
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await fetch("http://localhost:3000/api/posts", {
          credentials: 'include'
        });
        this.posts = await response.json();
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    async deleteAllPosts() {
      if (!confirm("Are you sure you want to delete all posts?")) return;

      try {
        await fetch("http://localhost:3000/api/posts", {
          method: "DELETE",
          credentials: 'include'
        });
        this.posts = []; // Clear local posts list
      } catch (error) {
        console.error("Error deleting posts:", error);
      }
    },
    Logout() {
      fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: 'include'
      })
        .then(() => {
          console.log('Logged out');
          location.assign("/login");
        })
        .catch(() => console.log("Error logging out"));
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleString();
    }
  }
};
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: auto;
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

.posts-list ul {
  list-style-type: none;
  padding: 0;
}

.posts-list li {
  padding: 10px;
  margin-bottom: 5px;
  background: #f5f5f5;
  border-radius: 4px;
}

.posts-list li a {
  text-decoration: none;
  color: #333;
}

.posts-list li a:hover {
  text-decoration: underline;
}
</style>