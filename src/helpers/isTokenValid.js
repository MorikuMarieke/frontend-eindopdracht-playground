const isTokenValid = () => {
    const expiryTime = localStorage.getItem("spotify_token_expiry");
    return expiryTime ? Date.now() < parseInt(expiryTime, 10) : false;
};

export default isTokenValid;