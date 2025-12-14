export default {
    user: { authenticated: false },
    authenticated: function() {
    fetch("http://localhost:3000/auth/authenticate", {
        credentials: 'include'})
            .then((response) => response.json())
            .then((data) => {
                this.user.authenticated = data.authenticated;
            })
            .catch(() => {
                console.log("error logout");});
                return this.user.authenticated;}
}