<template>
    <div class="signup">
        <div class="signup-content">
            <div class="signup-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" name="email" required v-model="email">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" required v-model="password">
                </div>
                <button @click="SignUp" class="signup-btn">Signup</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SignUpForm',
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        SignUp() {
            var data = { email: this.email, password: this.password };
            fetch("http://localhost:3000/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then(() => {
                    location.assign("/");
                })
                .catch(() => {
                    console.log("error");
                });
        }
    }
};
</script>

<style scoped>
.signup {
    font-family: Arial, sans-serif;
    margin: 0;
    background: #f0f0f0;
    display: flex;
    flex-direction: column;
    min-height: 70vh;
    padding: 20px;
}
.signup-content {
    max-width: 500px;
    margin: auto;
    background: #fff;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}
.signup-form .form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.signup-form label {
  font-weight: bold;
  margin-bottom: 5px;
}

.signup-form input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.signup-btn {
  padding: 10px 20px;
  background: #004080;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.signup-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.signup-btn:hover:not(:disabled) {
  opacity: 0.9;
}

</style>