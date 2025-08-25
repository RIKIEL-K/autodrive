import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const driverId = id;
  useEffect(() => {
    loadCars();
  }, [driverId]);

  const loadCars = () => {
    setLoading(true);
    api.get(`/voitures/driver/${driverId}`)
      .then(res => {
        setCars([res.data]);
        setSelectedCarId(res.data.id);
      })
      .catch(() => {
        setCars([]);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    setLoading(true);
    api.delete(`/voitures/${id}`)
      .then(() => {
        setSuccessMessage("Voiture supprimée avec succès.");
        setSelectedCarId(null);
        return loadCars();
      })
      .catch(err => console.error("Erreur suppression :", err))
      .finally(() => {
        setLoading(false);
        setTimeout(() => setSuccessMessage(""), 5000);
      });
  };

  const handleEdit = (driverId, carId) => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/editcar/${driverId}/${carId}`);
    }, 700);
  };

  const handleAddCar = () => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/addcar/${driverId}`);
    }, 900);
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'premium': return 'bg-primary';
      case 'standard': return 'bg-secondary';
      case 'luxe': return 'bg-warning text-dark';
      default: return 'bg-light text-dark';
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Navbar />
      <div className="container-fluid py-5" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {successMessage}
                <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
              </div>
            )}

            <div className="card shadow-lg border-0 rounded-4 mb-4">
              <div className="card-header bg-primary text-white rounded-top-4 px-4 py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Gestion des voitures</h5>
                {cars.length === 0 && (
                  <button className="btn btn-light text-primary btn-sm" onClick={handleAddCar}>
                    <i className="fas fa-plus me-1"></i>Ajouter une voiture
                  </button>
                )}
              </div>

              <div className="card-body px-4 py-4">
                <div className="row g-4">
                  {cars.map(car => (
                    <div className="col-md-6" key={car.id}>
                      <div className={`border rounded p-3 shadow-sm ${selectedCarId === car.id ? 'border-primary' : 'bg-white'}`}>
                        <div className="form-check d-flex justify-content-between align-items-center mb-2">
                          <input
                            className="form-check-input me-2"
                            type="radio"
                            name="selectedCar"
                            checked={selectedCarId === car.id}
                            onChange={() => setSelectedCarId(car.id)}
                          />
                          <h6 className="mb-0">
                            {car.marque} {car.modele}
                            <span className={`badge ms-2 ${getBadgeColor(car.classe)}`}>
                              {car.classe.toUpperCase()}
                            </span>
                          </h6>
                          <div className="d-flex gap-2">
                            <i
                              className="fas fa-pencil-alt text-primary cursor-pointer"
                              onClick={() => handleEdit(car.driverId, car.id)}
                            ></i>
                            <i
                              className="fas fa-trash-alt text-danger cursor-pointer"
                              onClick={() => handleDelete(car.id)}
                            ></i>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div>
                            <small className="text-muted d-block">Plaque</small>
                            <span className="fw-bold">{car.numeroDePlaque}</span>
                          </div>
                          <div>
                            <small className="text-muted d-block">VIN</small>
                            <span className="fw-bold">{car.niv}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {cars.length === 0 && (
                    <div className="text-center text-muted py-3">Aucune voiture enregistrée</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarManagement;
