<template>
    <div class="login">
        <div class="login-content">
            <div class="login-form">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" name="email" required v-model="email">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" required v-model="password">
                </div>
                <div class="container">
                    <button @click="LogIn" class="login-btn">Login</button>
                    <button @click='this.$router.push("/signup")' class="signup-btn">Signup</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoginForm',
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        LogIn() {
            var data = { email: this.email, password: this.password };
            fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                credentials: 'include',
                body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then(() => {
                    console.log(data);
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
.login {
    font-family: Arial, sans-serif;
    margin: 0;
    background: #f0f0f0;
    display: flex;
    flex-direction: column;
    min-height: 70vh;
    padding: 20px;
}

.login-content {
    max-width: 500px;
    margin: auto;
    background: #fff;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.login-form .form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
}

.login-form label {
    font-weight: bold;
    margin-bottom: 5px;
}

.login-form input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.signup-btn,
.login-btn {
    padding: 10px 20px;
    margin-right: 20px;
    background: #004080;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.signup-btn:disabled,
.login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.signup-btn:hover:not(:disabled),
.login-btn:hover:not(:disabled) {
    opacity: 0.9;
}
</style>