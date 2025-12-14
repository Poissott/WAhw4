<template>
	<header class="header">
		<nav class="nav">
            <router-link to="/" class="navigate">Home</router-link>
			<router-link to="/contacts" class="navigate">Contacts</router-link>
		</nav>
	</header>
</template>

<script>
export default {
	name: 'AppHeader'
}
</script>

<style scoped>
.header {
    background: #ccc;
    padding: 10px;
    text-align: center;
}
.nav {
	background: #eee;
    padding: 20px 30px;
    justify-content: space-between;
    align-items: center;
}
.navigate {
    margin: 0 15px;
    color: #333;
    font-weight: bold;
}
.navigate:hover {
    background-color: #ccc;
    border-radius: 4px;
    padding: 4px 8px;
}
</style>