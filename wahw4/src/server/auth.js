module.exports = {
    user: { authenticated: false },
    authenticated: async function() {
        try {
            const response = await fetch("http://localhost:3000/auth/authenticate", {
                credentials: 'include'
            });
            const data = await response.json();
            this.user.authenticated = data.authenticated;
            return this.user.authenticated;
        } catch (error) {
            console.log("error authenticating");
            return false;
        }
    }
}