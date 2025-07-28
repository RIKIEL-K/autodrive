import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../assets/css/main.css';
import '../assets/css/custom.css';
import usermap from '../assets/images/uber_map.jpg';
import Navbar from '../components/Navbar';
import AuthService from '../services/Authservice';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/');
    } else if (AuthService.getRole() === 'DRIVER') {
      navigate(`/driver-dashboard/${AuthService.getUserId()}`);
    }else if (AuthService.getRole() === 'USER') {
      navigate(`/user-dashboard/${AuthService.getUserId()}`);
    }
  }, [navigate]);
  return (

    <main className="main">
    <><Navbar/></>
      <section id="hero" className="hero section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-6 d-flex flex-column justify-content-center px-5">
              <h1 className="fw-bold display-5 text-primary">Déplacez-vous facilement avec AutoDrive</h1>
              <p className="lead">Commandez un taxi où que vous soyez et découvrez un service fiable et rapide.</p>
              <form className="mt-3">
                <input type="text" className="form-control mb-3" placeholder="Lieu de prise en charge" />
                <input type="text" className="form-control mb-3" placeholder="Destination" />
                <button type="submit" className="btn btn-primary">Voir les prix</button>
              </form>
            </div>
            <div className="col-lg-6">
              <img src={usermap} className="img-fluid rounded shadow" alt="map" />
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="services section py-5 bg-white">
        <div className="container text-center">
          <h2 className="text-primary mb-4">Nos Services</h2>
          <div className="row gy-4">
            <div className="col-md-4">
              <div className="service-item p-4 border rounded shadow-sm">
                <div className="icon mb-3"><i className="bi bi-car-front fs-1 text-primary"></i></div>
                <h4>Commander un taxi</h4>
                <p>Réservez facilement un taxi à proximité.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service-item p-4 border rounded shadow-sm">
                <div className="icon mb-3"><i className="bi bi-currency-dollar fs-1 text-primary"></i></div>
                <h4>Devenir chauffeur</h4>
                <p>Proposez vos services de transport et gagnez de l’argent.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="service-item p-4 border rounded shadow-sm">
                <div className="icon mb-3"><i className="bi bi-headset fs-1 text-primary"></i></div>
                <h4>Assistance 24/7</h4>
                <p>Nous sommes disponibles à tout moment pour vous aider.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section id="temoignages" className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="text-primary mb-4">Témoignages</h2>
          <div className="row">
            <div className="col-md-4">
              <p><i className="bi bi-quote"></i> Service fiable et rapide !</p>
              <h5 className="fw-bold">Saul Goodman</h5>
            </div>
            <div className="col-md-4">
              <p><i className="bi bi-quote"></i> Chauffeurs pros et appli simple.</p>
              <h5 className="fw-bold">Sara Wilsson</h5>
            </div>
            <div className="col-md-4">
              <p><i className="bi bi-quote"></i> Très pratique pour mes déplacements !</p>
              <h5 className="fw-bold">Jena Karlis</h5>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-5">
        <div className="container text-center">
          <h2 className="text-primary mb-4">Contactez-nous</h2>
          <p>Une question ? Une remarque ? Écrivez-nous !</p>
          <form className="row justify-content-center">
            <div className="col-md-6">
              <input type="text" className="form-control mb-3" placeholder="Votre nom" required />
              <input type="email" className="form-control mb-3" placeholder="Votre email" required />
              <textarea className="form-control mb-3" rows="4" placeholder="Votre message" required></textarea>
              <button type="submit" className="btn btn-primary">Envoyer</button>
            </div>
          </form>
        </div>
      </section>

      <section id="about" className="py-5 bg-white">
        <div className="container text-center">
          <h2 className="text-primary mb-4">À propos</h2>
          <p>AutoDrive connecte passagers et chauffeurs en toute sécurité. Notre mission : vous faire voyager confortablement, à tout moment.</p>
        </div>
      </section>

    </main>
  );
};

export default Index;
