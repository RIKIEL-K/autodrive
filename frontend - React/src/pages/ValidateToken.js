import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../utils/api';

function ValidateToken() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post(`/auth/validate-token`, { token }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        
        navigate('/reset-password', { state: { token } });
      }
    } catch (err) {
      setError(err.response?.data || 'Token invalide ou une erreur est survenue.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card card-style text-center p-4 shadow rounded-4" style={{ maxWidth: '420px', width: '100%' }}>
        <h4 className="fw-bold mb-3">Entrer le token</h4>
        <p className="text-muted mb-4">Copiez et collez le token reçu par e-mail pour continuer la réinitialisation de votre mot de passe.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <input
              type="text"
              className="form-control"
              name="token"
              placeholder="Code ou token reçu"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>

          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary">Valider</button>
          </div>

          {error && <div className="alert alert-danger text-center small">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default ValidateToken;
