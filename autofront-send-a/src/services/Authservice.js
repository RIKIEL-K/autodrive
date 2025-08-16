const KEY = '00001789045612340000000000000000'; // Clé unique pour stocker les données d'authentification

const AuthService = {
  login({ token, refreshToken, userId, firstname, role }) {
    localStorage.setItem(
      KEY,
      JSON.stringify({ token, refreshToken, userId, firstname, role })
    );
  },
  logout() {
    localStorage.removeItem(KEY);
  },
  isAuthenticated() {
    return !!this.getToken();
  },
  getToken() {
    return JSON.parse(localStorage.getItem(KEY) || '{}').token;
  },
  getRefreshToken() {
    return JSON.parse(localStorage.getItem(KEY) || '{}').refreshToken;
  },
  getUserId() {
    return JSON.parse(localStorage.getItem(KEY) || '{}').userId;
  },
  getRole() {
    return JSON.parse(localStorage.getItem(KEY) || '{}').role;
  },
};

export default AuthService;
