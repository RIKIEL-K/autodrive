// login est un objet qui attends des parametres token, userId, firstname et role
const AuthService = {
  login: ({ token, userId, firstname, role }) => {
    const expirationTime = new Date().getTime() + 3* 60 * 1000;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('firstname', firstname);
    localStorage.setItem('role', role);
    localStorage.setItem('expirationTime', expirationTime);
  },
  logout: () => {
    localStorage.clear();
  },
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');
    if (!token || !expirationTime) return false;

    const currentTime = new Date().getTime();
    if (currentTime > expirationTime) {
      AuthService.logout();
      return false;
    }
     return true;
  },
  getToken: () => localStorage.getItem('token'),
  getUserId: () => localStorage.getItem('userId'),
  getFirstname: () => localStorage.getItem('firstname'),
  getRole: () => localStorage.getItem('role')
};

export default AuthService;
// Ce service est utilisé pour gérer l'authentification de l'utilisateur dans l'application. Il permet de stocker et de récupérer les informations d'authentification dans le stockage local du navigateur, facilitant ainsi la gestion de la session utilisateur.
// Il fournit des méthodes pour se connecter, se déconnecter, vérifier si l'utilisateur est authentifié et récupérer les informations de l'utilisateur telles que le token, l'ID utilisateur, le prénom et le rôle. Ces informations sont essentielles pour contrôler l'accès aux différentes parties de l'application en fonction du rôle de l'utilisateur (par exemple, ADMIN, USER, DRIVER).