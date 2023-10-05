export function getAuthHeader () {
    const user = JSON.parse(sessionStorage.getItem("profile"));
    if(user && user.accessToken) {
        return `Bearer ${user.accessToken}`;
    }
    return null;
}