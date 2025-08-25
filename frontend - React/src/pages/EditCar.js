import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const EditCar = () => {
  const [formData, setFormData] = useState({
    vin: "",
    plate: "",
    year: "",
    brand: "",
    model: "",
    color: "",
    type: "standard",
  });

  const { driverId, id } = useParams();
  const navigate = useNavigate();
  const [carId, setCarId] = useState(null);

  useEffect(() => {
    api.get(`/voitures/driver/${driverId}`)
      .then((res) => {
        const car = res.data;
        setCarId(car.id);
        setFormData({
          vin: car.niv,
          plate: car.numeroDePlaque,
          year: car.annee,
          brand: car.marque,
          model: car.modele,
          color: car.couleur,
          type: car.classe,
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur : " + err.response?.data?.message || err.message);
      });
  }, [driverId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedCar = {
      id: carId,
      driverId,
      niv: formData.vin,
      numeroDePlaque: formData.plate,
      annee: parseInt(formData.year),
      marque: formData.brand,
      modele: formData.model,
      couleur: formData.color,
      classe: formData.type,
    };

    api.put(`/voitures/${id}`, updatedCar)
      .then(() => {
        alert("Voiture modifiée avec succès !");
        navigate(`/car/${driverId}`);
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur : " + err.response?.data?.message || err.message);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid py-5" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg rounded-4 border-0">
              <div className="card-header bg-primary text-white text-center rounded-top-4 py-4">
                <h5 className="mb-0">Modifier la voiture</h5>
              </div>
              <div className="card-body px-4 py-4">
                <form onSubmit={handleSubmit}>
                  {[
                    { id: "vin", label: "NIV (VIN)", type: "text" },
                    { id: "plate", label: "Numéro de plaque", type: "text" },
                    { id: "year", label: "Année", type: "number" },
                    { id: "brand", label: "Marque", type: "text" },
                    { id: "model", label: "Modèle", type: "text" },
                    { id: "color", label: "Couleur", type: "text" },
                  ].map(({ id, label, type }) => (
                    <div className="mb-3" key={id}>
                      <label htmlFor={id} className="form-label">{label}</label>
                      <input
                        type={type}
                        className="form-control"
                        id={id}
                        name={id}
                        value={formData[id]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}
                  <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type</label>
                    <select className="form-select" id="type" name="type" value={formData.type} onChange={handleChange} required>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="luxe">Luxe</option>
                    </select>
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                    Enregistrer les modifications
                    </button>
                  </div>
                </form>
              </div>
              <div className="text-center mt-4">
                <a href="/car" className="text-primary text-decoration-none">
                  <i className="fas fa-arrow-left me-2"></i>Retour à la liste
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCar;
