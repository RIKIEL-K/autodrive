import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-4 mt-5">
      <div className="container-fluid px-4">
        <div className="row align-items-center justify-content-between">
        
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <span className="text-light">
              © {new Date().getFullYear()} <strong>Autodrive</strong> – Conduite autonome, avenir intelligent.
            </span>
          </div>

          <div className="col-md-6">
            <ul className="nav justify-content-center justify-content-md-end align-items-center">
              <li className="nav-item">
                <a href="/about" className="nav-link px-2 text-white text-opacity-75">À propos</a>
              </li>
              <li className="nav-item">
                <a href="/technology" className="nav-link px-2 text-white text-opacity-75">Technologies</a>
              </li>
              <li className="nav-item">
                <a href="/contact" className="nav-link px-2 text-white text-opacity-75">Contact</a>
              </li>
              <li className="nav-item">
                <a href="/legal" className="nav-link px-2 text-white text-opacity-75">Mentions légales</a>
              </li>
              <li className="nav-item d-flex align-items-center ps-3">
                <a href="https://github.com/autodrive-project" target="_blank" rel="noreferrer" className="text-white text-opacity-75">
                  <i className="fab fa-github fs-5"></i>
                </a>
                <a href="https://linkedin.com/company/autodrive" target="_blank" rel="noreferrer" className="text-white text-opacity-75 ms-3">
                  <i className="fab fa-linkedin fs-5"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
