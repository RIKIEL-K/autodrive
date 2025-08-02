import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../assets/css/main.css';
import '../assets/css/custom.css';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import axios from 'axios';
import api from '../utils/api';

const DriverDashboard = () => {
  const [enLigne, setEnLigne] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const checkIfDriverHasCar = async () => {
    try {
      const res = await api.get(`/drivers/${id}/has-car`);
      return res.data === true;
    } catch (err) {
      console.error("Erreur lors de la vérification de la voiture :", err);
      return false;
    }
  };

  const updateDriverStatus = async (status, coords = null) => {
    try {
      const body = {
        enLigne: status,
        latitude: coords?.lat || null,
        longitude: coords?.lng || null
      };
      await api.put(`/drivers/en-ligne/${id}`, body);
    } catch (err) {
      console.error("Erreur backend :", err);
      alert("Erreur de mise à jour du statut en ligne.");
    }
  };

  const toggleStatus = async () => {
    const newStatus = !enLigne;

    if (newStatus) {
      const hasCar = await checkIfDriverHasCar();
      if (!hasCar) {
        setShowModal(true);
        return;
      }
    }

    setEnLigne(newStatus);

    if (newStatus) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          await updateDriverStatus(true, coords);
          setLoading(false);
          navigate(`/list-course-disponible/${id}`, { state: { position: coords } });
        },
        (err) => {
          console.error("Erreur de géolocalisation :", err);
          alert("Veuillez autoriser la géolocalisation pour passer en ligne.");
          setEnLigne(false);
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      updateDriverStatus(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <Navbar />
      <div className="container-fluid py-4 px-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="enLigneSwitch"
              checked={enLigne}
              onChange={toggleStatus}
              disabled={loading}
            />
            <label className="form-check-label fw-bold text-primary" htmlFor="enLigneSwitch">
              {enLigne ? 'En ligne' : 'Hors ligne'}
            </label>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-primary" onClick={() => navigate('/parametres')}>
              Paramètres
            </button>
          </div>
        </div>

        <div className="row justify-content-between">
          <DashboardCard title="Commandes" text="Vos commandes actives et historiques." onClick={() => navigate(`/commandes/${id}`)} />
          <DashboardCard title="Facturation" text="Suivez vos paiements et revenus." onClick={() => navigate('/facturation')} />
          <DashboardCard title="Voiture" text="Informations sur votre véhicule." onClick={() => navigate(`/car/${id}`)} />
          <DashboardCard title="Ma banque" text="Vos informations bancaires." onClick={() => navigate(`/driver/finance/${id}`)} />
          <DashboardCard className="mt-2" title="Contact" text="Messagerie avec vos clients et l’équipe." onClick={() => navigate(`/contact/${id}`)} />
        </div>
      </div>

      {/* Modal Bootstrap */}
      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Voiture non configurée</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Vous devez d'abord configurer une voiture avant de pouvoir passer en ligne.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Fermer</button>
              <button className="btn btn-primary" onClick={() => navigate(`/car/${id}`)}>Configurer la voiture</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, text, onClick }) => (
  <div className="col-md-3">
    <div className="card shadow text-center border-0">
      <div className="card-body py-4">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{text}</p>
        <button className="btn btn-outline-primary btn-sm" onClick={onClick}>Voir</button>
      </div>
    </div>
  </div>
);

export default DriverDashboard;
