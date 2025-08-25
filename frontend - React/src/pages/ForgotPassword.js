import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import api from '../utils/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await api.post(`/auth/forgot-password`, { email }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setMessage(response.data);

      
      setTimeout(() => {
        navigate('/validate-token'); 
      }, 2000); 
    } catch (err) {
      setError(err.response?.data || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Réinitialiser le mot de passe</h3>
          <p className="text-muted small mt-2">
            Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary fw-bold text-white">Envoyer le lien</button>
          </div>

          {message && <div className="alert alert-success small text-center">{message}</div>}
          {error && <div className="alert alert-danger small text-center">{error}</div>}

          <div className="text-center small">
            Pas encore membre ? <a href="/" className="text-decoration-none">S'enregistrer !</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
