import React, { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const AddCard = () => {
  const [formData, setFormData] = useState({
    holder: "",
    number: "",
    expiration: "",
    cvv: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Carte soumise :", formData);
    // Appel API ou mise à jour globale ici
  };

  return (
    <div>
    <Navbar />
    <div className="container-fluid py-5" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg rounded-4 border-0">
            <div className="card-header bg-primary text-white text-center rounded-top-4 py-4">
              <h5 className="mb-0">Ajouter une carte bancaire</h5>
            </div>
            <div className="card-body px-4 py-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="holder" className="form-label">Nom du titulaire</label>
                  <input
                    type="text"
                    className="form-control"
                    id="holder"
                    name="holder"
                    value={formData.holder}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="number" className="form-label">Numéro de carte</label>
                  <input
                    type="text"
                    className="form-control"
                    id="number"
                    name="number"
                    maxLength="19"
                    placeholder="**** **** **** ****"
                    value={formData.number}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="expiration" className="form-label">Expiration</label>
                    <input
                      type="text"
                      className="form-control"
                      id="expiration"
                      name="expiration"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={formData.expiration}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="cvv" className="form-label">CVV</label>
                    <input
                      type="password"
                      className="form-control"
                      id="cvv"
                      name="cvv"
                      maxLength="4"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-plus-circle me-2"></i>Ajouter la carte
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-4">
            <a href="/" className="text-primary text-decoration-none">
              <i className="fas fa-arrow-left me-2"></i>Retour au tableau de bord
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddCard;
