import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../utils/api';

function UpdatePassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.token) {
      setToken(location.state.token);
    } else {
      setError("Token manquant. Veuillez recommencer le processus de réinitialisation.");
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await api.post(`/auth/update-password`, {
        token,
        newPassword
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setMessage(response.data);

      // Redirection après un court délai pour afficher le message
      setTimeout(() => {
        navigate('/'); 
      }, 2000);
    } catch (err) {
      setError(err.response?.data || "Une erreur est survenue.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Réinitialiser votre mot de passe</h3>
          <p className="text-muted small">Entrez votre nouveau mot de passe.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold text-white">Mettre à jour le mot de passe</button>
        </form>

        {message && <div className="alert alert-success text-center mt-3 small">{message}</div>}
        {error && <div className="alert alert-danger text-center mt-3 small">{error}</div>}
      </div>
    </div>
  );
}

export default UpdatePassword;
