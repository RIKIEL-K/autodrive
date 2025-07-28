import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loading from "../components/Loading";
import AuthService from "../services/Authservice";
import api from "../utils/api";

const Register = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(role?.toLowerCase() || "user");

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    profilePhoto: "",
    dateNaissance: "",
    role: selectedRole.toUpperCase()
  });

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate(`/index/${AuthService.getUserId()}`);
      return;
    }

    const validRoles = ["driver", "user"];
    if (!validRoles.includes(role?.toLowerCase())) {
      alert("Rôle invalide !");
      navigate("/");
    }
  }, [role, navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    setUser(prev => ({ ...prev, role: newRole.toUpperCase() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint =
      selectedRole === "driver"
        ? `/drivers/register`
        : `/auth/register`;

    try {
      await api.post(endpoint, user);
      setTimeout(() => {
        navigate(`/login/${selectedRole}`);
        console.log("Inscription réussie !");
      }, 1500);
    } catch (err) {
      console.error("Erreur Axios :", err);
      alert("Erreur : " + (err.response?.data || err.message));
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card card-style p-4 shadow" style={{ maxWidth: 400, width: "100%", borderRadius: 15 }}>
        <ul className="nav nav-pills nav-justified mb-4">
          <li className="nav-item">
            <span className="nav-link active">Register</span>
          </li>
        </ul>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Type d'utilisateur</label>
            <select className="form-select" value={selectedRole} onChange={handleRoleChange}>
              <option value="user">Utilisateur</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          <input name="firstname" className="form-control mb-2" placeholder="Name" onChange={handleChange} required />
          <input name="lastname" className="form-control mb-2" placeholder="Username" onChange={handleChange} required />
          <input name="email" type="email" className="form-control mb-2" placeholder="Email" onChange={handleChange} required />
          <input name="address" className="form-control mb-2" placeholder="Adresse" onChange={handleChange} required />
          <input name="phoneNumber" className="form-control mb-2" placeholder="Téléphone" onChange={handleChange} required />
          <input name="dateNaissance" type="date" className="form-control mb-2" onChange={handleChange} />
          <input name="password" type="password" className="form-control mb-2" placeholder="Mot de passe" onChange={handleChange} required />

          <div className="form-check d-flex justify-content-start mb-3">
            <input className="form-check-input me-2" type="checkbox" id="termsCheck" required />
            <label className="form-check-label text-small" htmlFor="termsCheck">
              J'accepte les conditions d'utilisation
            </label>
          </div>

          <button type="submit" className="btn btn-register w-100 text-white mb-3" style={{ backgroundColor: '#3b6efb' }}>
            S'inscrire
          </button>

          <div className="text-center">
            <small>
              Déjà inscrit ? <Link to={`/login/${selectedRole}`}>Connexion</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
