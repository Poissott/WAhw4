<template>
    <div class="form">
        <h3>LogIn</h3>
        <label for="email">Email</label>
        <input type="email" name="email" required v-model="email">
        <label for="password">Password</label>
        <input type="password" name="password" required v-model="password">
        <div class="container">
            <button @click="LogIn" class="center">LogIn</button>
            <button @click='this.$router.push("/signup")' class="center">Signup</button>
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