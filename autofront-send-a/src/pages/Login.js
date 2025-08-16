import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthService from '../services/Authservice';
import Loading from '../components/Loading';
import api from '../utils/api';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('USER'); // USER | DRIVER (en majuscules pour le backend)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      const role = AuthService.getRole();
      const id = AuthService.getUserId();
      goToDashboard(role, id);
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const goToDashboard = (role, id) => {
    if (role === 'DRIVER') return navigate(`/driver-dashboard/${id}`);
    return navigate(`/user-dashboard/${id}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');

    try {
      // endpoint unique
      const { data } = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        role: selectedRole,       // "USER" ou "DRIVER"
      });

      // token + refreshToken + infos
      AuthService.login({
        token: data.token,
        refreshToken: data.refreshToken,
        userId: data.userId,
        firstname: data.firstname,
        role: data.role, // renvoyé par le backend
      });

      goToDashboard(data.role, data.userId);
    } catch (err) {
      console.error('Erreur de connexion :', err);
      setError(err.response?.data?.error || 'Erreur serveur inattendue.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 420, width: '100%' }}>
        <h3 className="text-center mb-4">Connexion</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Se connecter en tant que :</label>
            <select
              className="form-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="USER">Utilisateur</option>
              <option value="DRIVER">Chauffeur</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Adresse email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              name="password"
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-dark w-100" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/forgot-password" className="text-decoration-none text-primary">
            Mot de passe oublié ?
          </a>
        </div>

        <div className="text-center mt-3">
          <a href="/register" className="text-decoration-none">Créer un compte</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
