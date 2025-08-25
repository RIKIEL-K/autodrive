import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: ""
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message envoyé :", formData);
    setSent(true);
    setFormData({ nom: "", email: "", sujet: "", message: "" });
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Navbar />
      <div className="container py-5" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4 py-3 px-4">
                <h5 className="mb-0"><i className="bi bi-headset me-2"></i>Contacter l’équipe technique</h5>
              </div>

              <div className="card-body px-4 py-4">
                {sent && (
                  <div className="alert alert-success" role="alert">
                    Votre message a été envoyé avec succès. Nous vous répondrons sous peu.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="nom" className="form-label">Nom</label>
                    <input type="text" className="form-control" id="nom" name="nom" value={formData.nom} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Adresse email</label>
                    <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="sujet" className="form-label">Sujet</label>
                    <input type="text" className="form-control" id="sujet" name="sujet" value={formData.sujet} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea className="form-control" id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Envoyer
                  </button>
                </form>

                <hr className="my-4" />

                <div className="text-muted small">
                  <i className="bi bi-info-circle me-2"></i>
                  Vous pouvez aussi nous écrire à <strong>support@autodrive.tech</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
