import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthService from '../services/Authservice';
import Loading from '../components/Loading';
import api from '../utils/api';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const navigate = useNavigate();
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate(`/index/${AuthService.getUserId()}`);
    }
  }, [navigate]);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const endpoint =
      selectedRole === "driver"
        ? `/drivers/login`
        : `/auth/login`;

    try {
      const res = await api.post(endpoint, formData);
      const { token, userId, firstname } = res.data;

      AuthService.login({
        token,
        userId,
        firstname,
        role: selectedRole.toUpperCase()
      });

      setTimeout(() => {
        navigate(`/${selectedRole}-dashboard/${userId}`);
      }, 1000);

    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError(err.response?.data?.error || "Erreur serveur inattendue.");
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
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
              <option value="user">Utilisateur</option>
              <option value="driver">Véhicule</option>
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
            />
          </div>

          <button type="submit" className="btn btn-dark w-100">Se connecter</button>
        </form>

        <div className="text-center mt-3">
          <a href="/forgot-password" className="text-decoration-none text-primary">
            Mot de passe oublié ?
          </a>
        </div>

        <div className="text-center mt-3">
          <a href="/" className="text-decoration-none">Créer un compte</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
