import React from "react";
import { useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthService from "../services/Authservice";


const Navbar = () => {
  
  const navigate = useNavigate();

  const handleLogout = () =>{
    AuthService.logout();
    navigate('/');
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid px-4">
        <a className="navbar-brand fw-bold text-white" href="/">
          Autodrive
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#autodriveNavbar"
          aria-controls="autodriveNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="autodriveNavbar">
           {AuthService.isAuthenticated() && (
              <>
                <button className="btn btn-outline-danger px-3" onClick={handleLogout}>
                  Déconnexion
                </button>
              </>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
