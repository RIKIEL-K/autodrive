import React, { useEffect, useState } from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const GOOGLE_API_KEY = "AIzaSyAg4qOhqE5rG5XGn_-q16WVCN7pKWUJ170";

const TaxiDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isOnline, setIsOnline] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [refuseId, setRefuseId] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptOrder, setAcceptOrder] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [position, setPosition] = useState(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = pos.coords;
        setPosition({ lat: coords.latitude, lng: coords.longitude });
        setIsOnline(true);
      },
      (err) => {
        console.error("Erreur géolocalisation :", err);
        alert("Veuillez autoriser la géolocalisation.");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const getAddress = async ([lng, lat]) => {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      return res.data.results[0]?.formatted_address || "Adresse inconnue";
    } catch (err) {
      return "Adresse inconnue";
    }
  };

  useEffect(() => {
    if (!isOnline || !position) return;

    const fetchCourses = async () => {
      try {
        const res = await api.get(`/courses/for-driver/${id}`, {
          params: {
            latitude: position.lat,
            longitude: position.lng,
          },
        });

        const data = await Promise.all(
          res.data.map(async (course) => ({
            id: course.id,
            client: course.user?.firstname || course.userId || "Client",
            from: await getAddress(course.depart.coordinates),
            to: await getAddress(course.destination.coordinates),
            price: course.prix,
            distance: `${course.distanceKm.toFixed(2)} km`,
          }))
        );

        setNotifications(data);
      } catch (error) {
        console.error("Erreur récupération des courses :", error);
      }
    };

    fetchCourses();
    const interval = setInterval(fetchCourses, 8000);
    return () => clearInterval(interval);
  }, [isOnline, position, id]);

  const handleAcceptRequest = (order) => {
    setAcceptOrder(order);
    setShowAcceptModal(true);
  };

  const confirmAccept = async () => {
    try {
      await api.put(`/courses/accept/${acceptOrder.id}`, null, {
        params: { driverId: id }
      });

      setChatOpen(true);
      setSelectedOrder(acceptOrder);
      setNotifications((prev) => prev.filter((n) => n.id !== acceptOrder.id));
      setShowAcceptModal(false);
      navigate(`/course-en-cours/${acceptOrder.id}`);
      window.open(
        `https://www.google.com/maps/dir/${encodeURIComponent(acceptOrder.from)}/${encodeURIComponent(acceptOrder.to)}`,
        "_blank"
      );
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
      alert("Une erreur est survenue lors de l'acceptation de la course.");
    }
  };

  const handleRefuseRequest = (id) => {
    setRefuseId(id);
    setShowRefuseModal(true);
  };

  const confirmRefuse = () => {
    setNotifications((prev) => prev.filter((n) => n.id !== refuseId));
    setShowRefuseModal(false);
    setRefuseId(null);
  };

  const toggleOnline = () => {
    setIsOnline((prev) => !prev);
    setNotifications([]);
    navigate(`/driver-dashboard/${id}`)
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid py-4" style={{ backgroundColor: "#f4f9ff", minHeight: "100vh" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className={isOnline ? "text-primary" : "text-muted"}>
            {isOnline ? "En ligne" : "Hors ligne"}
          </h4>

          <div className="d-flex gap-3 align-items-center">
            <button
              className={`btn ${isOnline ? "btn-outline-danger" : "btn-outline-success"}`}
              onClick={toggleOnline}
            >
              {isOnline ? "Passer hors ligne" : "Passer en ligne"}
            </button>

            <button className="btn btn-outline-primary position-relative">
              <i className="fas fa-bell"></i>
              {notifications.length > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {notifications.length}
                </Badge>
              )}
            </button>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-header bg-primary text-white rounded-top-4">
                <h6 className="mb-0">Commandes</h6>
              </div>
              <div className="card-body">
                {notifications.length === 0 ? (
                  <p className="text-muted">Aucune commande en attente.</p>
                ) : (
                  notifications.map((order) => (
                    <div key={order.id} className="border rounded p-3 mb-3 bg-light">
                      <h6>{order.client}</h6>
                      <p className="mb-1">{order.from} à {order.to}</p>
                      <p className="mb-1 small">{order.distance} - {order.price} $</p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-success" onClick={() => handleAcceptRequest(order)}>Accepter</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleRefuseRequest(order.id)}>Refuser</button>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedOrder(order)}>Détails</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm border-0 rounded-4 h-100">
              <div className="card-header bg-primary text-white rounded-top-4">
                <h6 className="mb-0"><i className="fas fa-info-circle me-2"></i>Détails</h6>
              </div>
              <div className="card-body">
                {selectedOrder ? (
                  <>
                    <p><strong>Client :</strong> {selectedOrder.client}</p>
                    <p><strong>Départ :</strong> {selectedOrder.from}</p>
                    <p><strong>Destination :</strong> {selectedOrder.to}</p>
                    <p><strong>Distance :</strong> {selectedOrder.distance}</p>
                    <p><strong>Prix :</strong> {selectedOrder.price} $</p>

                    {chatOpen && (
                      <button className="btn btn-outline-primary mt-3" onClick={() => navigate(`/chat/${selectedOrder.id}`)}>
                        Ouvrir la messagerie
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-muted">Sélectionnez une commande pour voir les détails.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Modal show={showRefuseModal} onHide={() => setShowRefuseModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Refuser la commande ?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Voulez-vous vraiment refuser cette commande ?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRefuseModal(false)}>Annuler</Button>
            <Button variant="danger" onClick={confirmRefuse}>Confirmer</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Accepter la commande ?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Souhaitez-vous accepter cette commande et démarrer la course ?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>Annuler</Button>
            <Button variant="success" onClick={confirmAccept}>Confirmer</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default TaxiDashboard;
