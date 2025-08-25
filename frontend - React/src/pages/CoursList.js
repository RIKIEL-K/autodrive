import React, { useEffect, useState } from "react";
import { Modal, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CourseSelectionPage = () => {
  const navigate = useNavigate();
  const [categorie, setCategorie] = useState("classique");
  const [destination, setDestination] = useState("");
  const [userPosition, setUserPosition] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chauffeur, setChauffeur] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Erreur géolocalisation :", err);
      }
    );
  }, []);

  useEffect(() => {
    const allCourses = [
      {
        id: 1,
        from: "100 Rue Jean-Talon",
        to: "200 Boulevard Saint-Laurent",
        distance: "7.5 km",
        time: "18 min",
        price: 22,
        categorie: "classique",
      },
      {
        id: 2,
        from: "300 Rue Sherbrooke",
        to: "400 Rue Sainte-Catherine",
        distance: "9.2 km",
        time: "22 min",
        price: 35,
        categorie: "premier",
      },
      {
        id: 3,
        from: "600 Avenue Papineau",
        to: "700 Boulevard René-Lévesque",
        distance: "6.5 km",
        time: "15 min",
        price: 50,
        categorie: "limousine",
      },
    ];

    const filtered = allCourses.filter(
      (c) => c.categorie === categorie && (destination === "" || c.to.toLowerCase().includes(destination.toLowerCase()))
    );
    setCourses(filtered);
  }, [categorie, destination]);

  const handleValidation = (course) => {
    setSelectedCourse(course);
    setChauffeur({
      nom: "Jean Lafleur",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      plaque: "TAXI-321-MTL",
      vehicule: "Toyota Camry 2023",
    });

    setShowModal(true);
  };

  const confirmCommande = () => {
    setShowModal(false);
    navigate(`/course-en-cours/${selectedCourse.id}`);
  };

  return (
    <div className="container py-5" style={{ backgroundColor: "#f4f9ff" }}>
      <h3 className="text-primary mb-4">Réservez votre course</h3>

      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Entrez votre destination..."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <div className="btn-group mb-4">
        <button
          className={`btn btn-outline-primary ${categorie === "classique" ? "active" : ""}`}
          onClick={() => setCategorie("classique")}
        >
          Classique
        </button>
        <button
          className={`btn btn-outline-primary ${categorie === "premier" ? "active" : ""}`}
          onClick={() => setCategorie("premier")}
        >
          Premier
        </button>
        <button
          className={`btn btn-outline-primary ${categorie === "limousine" ? "active" : ""}`}
          onClick={() => setCategorie("limousine")}
        >
          Limousine
        </button>
      </div>

      <div className="row">
        {courses.length === 0 ? (
          <p className="text-muted">Aucune course disponible pour cette catégorie ou destination.</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="col-md-6 mb-4">
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body>
                  <h5 className="text-primary">Course #{course.id}</h5>
                  <p><strong>Départ :</strong> {course.from}</p>
                  <p><strong>Destination :</strong> {course.to}</p>
                  <p><strong>Distance :</strong> {course.distance}</p>
                  <p><strong>Durée :</strong> {course.time}</p>
                  <p><strong>Prix :</strong> {course.price} $</p>
                  <Button variant="primary" onClick={() => handleValidation(course)}>
                    Valider cette course
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de la commande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {chauffeur && (
            <>
              <div className="text-center mb-3">
                <img src={chauffeur.photo} alt="Chauffeur" className="rounded-circle" width={80} />
                <h5 className="mt-2">{chauffeur.nom}</h5>
              </div>
              <p><strong>Véhicule :</strong> {chauffeur.vehicule}</p>
              <p><strong>Plaque :</strong> {chauffeur.plaque}</p>
              <p><strong>Prix total :</strong> {selectedCourse?.price} $</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={confirmCommande}>Confirmer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseSelectionPage;
