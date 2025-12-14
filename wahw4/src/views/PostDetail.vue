<template>
  <div class="post-detail" v-if="post.id">
    <h2>Post Detail</h2>

    <div class="post-content">
      <p>{{ post.body }}</p>
      <p class="post-date"><small>{{ formatDate(post.date) }}</small></p>
    </div>

    <div class="edit-section">
      <h3>Edit Post</h3>
      <textarea v-model="updatedBody" placeholder="Update your post..."></textarea>
      <div class="buttons">
        <button @click="updatePost">Update</button>
        <button @click="deletePost" class="delete-btn">Delete</button>
        <button @click="$router.push('/')" class="cancel-btn">Back</button>
      </div>
    </div>
  </div>

  <div v-else class="loading">
    <p>Loading post...</p>
  </div>
</template>

<script>
export default {
  name: 'PostDetail',
  data() {
    return {
      post: {},
      updatedBody: ''
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    try {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        credentials: 'include'
      });

      if (!res.ok) {
        alert('Failed to fetch post');
        this.$router.push('/');
        return;
      }

      const data = await res.json();
      this.post = data;
      this.updatedBody = data.body;
    } catch (err) {
      console.error('Error fetching post:', err);
    }
  },
  methods: {
    async updatePost() {
      const id = this.$route.params.id;
      try {
        const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ body: this.updatedBody })
        });
        const data = await res.json();
        this.post = data;
        alert('Post updated!');
      } catch (err) {
        console.error('Error updating post:', err);
        alert('Failed to update post');
      }
    },
    async deletePost() {
      const id = this.$route.params.id;
      try {
        await fetch(`http://localhost:3000/api/posts/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        alert('Post deleted!');
        this.$router.push('/');
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post');
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    }
  }
};
</script>

<style scoped>
.post-detail {
  max-width: 700px;
  margin: 40px auto;
  background: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.1);
  font-family: Arial, sans-serif;
}

h2 {
  margin-bottom: 15px;
  color: #004080;
}

.post-content {
  margin-bottom: 25px;
}

.post-date {
  color: #555;
  font-size: 0.9em;
}

.edit-section h3 {
  margin-bottom: 10px;
  color: #004080;
}

textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  margin-bottom: 15px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: vertical;
}

.buttons {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  background-color: #004080;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.delete-btn {
  background-color: #c0392b;
}

.cancel-btn {
  background-color: #7f8c8d;
}
.loading {
  text-align: center;
  margin-top: 50px;
  font-size: 1.1em;
}
</style>
