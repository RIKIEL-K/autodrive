import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import api from '../utils/api';

function AccountSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    address: '',
    profilePhoto: '',
    visible: true
  });

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [useDefaultAddress, setUseDefaultAddress] = useState(false);

  useEffect(() => {
      api.get(`/users/profile/${id}`)
      .then(res => {
        setUser(res.data);
      })
      .catch(err => alert("Erreur lors du chargement : " + err.message));
  }, [id]);

  const handleChange = (e) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleVisibility = () => {
    api.put(`/users/toggle-visibility/${id}`)
      .then(res => {
        alert(res.data);
        setUser(prev => ({ ...prev, visible: !prev.visible }));
      })
      .catch(err => alert("Erreur de visibilité : " + err.message));
  };

  const handleSave = () => {
    if (!user.firstname || !user.lastname || !user.email) {
      return alert("Veuillez remplir tous les champs obligatoires.");
    }
    api.put(`/users/update/${id}`, user)
      .then(res => alert(res.data))
      .catch(err => alert("Erreur de sauvegarde : " + err.message));

    if (useDefaultAddress) {
      api.put(`/users/set-default-address/${id}`, {
        address: user.address
      }).then(res => console.log("Adresse par défaut mise à jour"))
        .catch(err => console.error(err));
    }
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      api.delete(`/users/delete/${id}`)
        .then(res => {
          alert(res.data);
          navigate("/");
        })
        .catch(err => alert("Erreur de suppression : " + err.message));
    }
  };

  const handleReset = () => {
    if (!window.confirm("Êtes-vous sûr de vouloir réinitialiser le formulaire ? Toutes les modifications seront perdues.")) {
        return;
    }
    api.put(`/users/reset-form/${id}`)
      .then(res => setUser(res.data))
      .catch(err => alert("Erreur de réinitialisation : " + err.message));
  };

  const handlePhotoChange = (e) => {
    setSelectedPhoto(e.target.files[0]);
  };

  const uploadPhoto = () => {
    if (!selectedPhoto) {
      return alert("Veuillez sélectionner une image.");
    }

    const formData = new FormData();
    formData.append("photo", selectedPhoto);

    api.put(`/users/update-photo/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(res => {
        alert(res.data);
        window.location.reload();
      })
      .catch(err => alert("Erreur lors de l'upload : " + err.message));
  };

  return (
    <div className="container my-5">
      <div className="card card-style p-4 shadow" style={{ maxWidth: '1000px', margin: 'auto', borderRadius: 15 }}>
        <nav className="mb-4"><small>Profile manage</small></nav>
        <h4 className="mb-3">Modifier le compte</h4>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item"><span className="nav-link active">Général</span></li>
          <li className="nav-item"><span className="nav-link active">Sécurité</span></li>
          <li className="nav-item"><span className="nav-link active">Vie privée</span></li>
        </ul>

        <div className="d-flex align-items-center mb-4">
          <img src={user.profilePhoto || "https://i.pravatar.cc/64"} className="rounded-circle me-3" alt="Avatar" style={{ width: 64, height: 64, objectFit: 'cover' }} />
          <div>
            <h6 className="mb-0">{user.firstname} {user.lastname}</h6>
            <a href={user.profilePhoto} className="text-decoration-none" target="_blank" rel="noreferrer">Voir la photo</a>
          </div>
          <div className="ms-auto d-flex">
            <input type="file" onChange={handlePhotoChange} accept="image/*" className="form-control form-control-sm me-2" />
            <button className="btn btn-outline-secondary btn-sm" onClick={uploadPhoto}>Changer de photo</button>
          </div>
        </div>

        <form>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <input type="text" name="firstname" value={user.firstname} onChange={handleChange} className="form-control" placeholder="First name" />
            </div>
            <div className="col-md-6">
              <input type="text" name="lastname" value={user.lastname} onChange={handleChange} className="form-control" placeholder="Last name" />
            </div>
            <div className="col-md-6">
              <input type="email" name="email" value={user.email} onChange={handleChange} className="form-control" placeholder="Email" />
            </div>
            <div className="col-md-6">
              <input type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} className="form-control" placeholder="Phone number" />
            </div>
            <div className="col-12">
              <input type="text" name="address" value={user.address} onChange={handleChange} className="form-control" placeholder="Address" />
            </div>
            <div className="col-12">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="defaultAddress" checked={useDefaultAddress} onChange={(e) => setUseDefaultAddress(e.target.checked)} />
                <label className="form-check-label" htmlFor="defaultAddress">Make this my default address</label>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-light me-2" onClick={handleReset}>Annuler</button>
            <button type="button" className="btn btn-dark" onClick={handleSave}>Enregistrer</button>
            <button type="button" className="btn btn-info mx-2">Modifier le mot de passe</button>
          </div>
        </form>

        <div className="row mt-5 g-3">
          <div className="col-md-6">
            <div className="p-4 bg-white border rounded">
              <h6>Supprimer le compte</h6>
              <p className="text-muted small">Action irréversible. Supprimez votre compte définitivement.</p>
              <button className="btn btn-danger" onClick={handleDelete}>Supprimer le compte</button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-4 bg-white border rounded d-flex justify-content-between align-items-center">
              <div>
                <h6>Rendre votre compte invisible</h6>
                <p className="text-muted small mb-0">Vous ne pourrez plus passer de commandes.</p>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" checked={!user.visible} onChange={toggleVisibility} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AccountSettings;
