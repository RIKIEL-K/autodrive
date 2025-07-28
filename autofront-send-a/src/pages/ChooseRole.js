import React from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import taxiImage from "../assets/images/taxi.webp";
import userImage from "../assets/images/user.jpg";

const ChooseRole = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row">
        <div className="col-md-6 d-flex justify-content-center mb-3 mb-md-0">
          <div className="card" style={{ width: "18rem" }}>
            <img src={taxiImage} className="card-img-top" alt="driver" />
            <div className="card-body text-center">
              <p className="card-text">Profitez de l'opportunité de servir les autres</p>
              <button onClick={() => navigate("/register/driver")} className="btn btn-primary">
                Conducteur
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-center">
          <div className="card" style={{ width: "18rem" }}>
            <img src={userImage} className="card-img-top" alt="user" />
            <div className="card-body text-center">
              <p className="card-text">Gagnez du temps avec notre service</p>
              <button onClick={() => navigate("/register/user")} className="btn btn-primary">
                Utilisateur
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseRole;
