import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ArriveeCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleNotifyArrivee = () => {
    alert("Vous avez notifié votre arrivée.");
    navigate( `/list-course-disponible/${id}`)
  };

  return (
    <div className="container py-5">
      <div className="text-center">
        <h3 className="text-primary mb-4">Course #{id} - En cours</h3>
        <p className="lead">Vous avez signalé que le passager est à bord.</p>
        <p>Une fois arrivé à destination, veuillez le notifier ci-dessous.</p>
        <button className="btn btn-primary mt-3" onClick={handleNotifyArrivee}>
          Notifier l’arrivée
        </button>
      </div>
    </div>
  );
};

export default ArriveeCourse;
