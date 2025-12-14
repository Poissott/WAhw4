<template>
  <div class="add-post">
    <h2>Add New Post</h2>
    <textarea v-model="body" placeholder="Write your post here..." rows="5"></textarea>
    <div class="buttons">
      <button @click="submitPost">Add Post</button>
      <button @click="$router.push('/')">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddPost',
  data() {
    return {
      body: ''
    };
  },
  methods: {
    async submitPost() {
      if (!this.body.trim()) {
        alert('Post cannot be empty');
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ body: this.body })
        });
        const data = await response.json();
        console.log('Post added:', data);
        this.$router.push('/'); // go back to Home
      } catch (error) {
        console.error('Error adding post:', error);
        alert('Failed to add post');
      }
    }
  }
};
</script>

<style scoped>
.add-post {
  max-width: 600px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
}
textarea {
  padding: 10px;
  font-size: 16px;
  margin-bottom: 15px;
  resize: vertical;
}
.buttons button {
  padding: 10px 15px;
  margin-right: 10px;
  background-color: #004080;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.buttons button:hover {
  opacity: 0.9;
}
</style>
