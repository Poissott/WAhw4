<template>
    <div class="form">
        <h3>SignUp</h3>
        <label for="email">Email</label>
        <input type="email" name="email" required v-model="email">
        <label for="password">Password</label>
        <input type="password" name="password" required v-model="password">
        <button @click="SignUp" class="SignUp">SignUp</button>
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