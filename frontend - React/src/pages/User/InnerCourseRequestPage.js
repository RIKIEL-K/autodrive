import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import axios from 'axios';
import Loading from '../../components/Loading';
import '../../assets/css/main.css';
import '../../assets/css/custom.css';
import api from '../../utils/api';

const InnerCourseRequestPage = ({ userPosition, userId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete();

  useEffect(() => {
    if (userPosition && ready) {
      setLoading(false);
    }
  }, [userPosition, ready]);

 
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/courses/status/${userId}`);
        if (res.data && res.data.status) {
          setCourseData(prev =>
            !prev || prev.id !== res.data.id || prev.status !== res.data.status
              ? res.data
              : prev
          );
        }
      } catch (err) {
        console.error("Erreur lors du polling du statut de la course :", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

 
  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    setLoading(true);
    setErrorMessage(null);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);

      const res = await api.post(`/courses/request`, {
        userId,
        depart: {
          latitude: userPosition.lat,
          longitude: userPosition.lng
        },
        destination: {
          latitude: lat,
          longitude: lng
        }
      });

      if (res.data?.message) {
        setErrorMessage(res.data.message);
        setCourseData(null);
      } else {
        setCourseData(res.data);
      }
    } catch (error) {
      const backendMessage = error.response?.data?.message || '';
      if (backendMessage.toLowerCase().includes('chauffeur')) {
        setErrorMessage("Aucun chauffeur trouvé à proximité.");
      } else {
        setErrorMessage(backendMessage || "Une erreur est survenue.");
      }
      setCourseData(null);
    } finally {
      setLoading(false);
    }
  };

 const goToChat = async () => {
   try {
     const res = await api.get(`courses/by-user/${userId}`);
     navigate(`/CourseInteractionPage/${res.data.id}`);
   } catch (error) {
     console.error("Impossible de récupérer la course :", error);
   }
 };

  if (loading) return <Loading />;

  return (
    <div className="container mt-5">
      <h3 className="text-primary mb-4">Où souhaitez-vous aller ?</h3>

      {errorMessage && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          {errorMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setErrorMessage(null)}
            aria-label="Fermer"
          ></button>
        </div>
      )}

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Entrez une destination"
        className="form-control mb-3"
      />

      {status === 'OK' && (
        <ul className="list-group mb-3">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(description)}
              style={{ cursor: 'pointer' }}
            >
              {description}
            </li>
          ))}
        </ul>
      )}

      {courseData && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow border-0 rounded-4 p-4 d-flex flex-column gap-3 position-relative">
              {courseData.status === 'ACCEPTEE' && (
                <span className="badge bg-success position-absolute top-0 end-0 m-3">
                  ACCEPTÉE
                </span>
              )}

              <div>
                <h5 className="text-primary mb-3">Détails de la course</h5>
                <p className="mb-1"><strong>Distance :</strong> {courseData.distanceKm?.toFixed(2)} km</p>
                <p className="mb-1"><strong>Prix :</strong> {courseData.prix?.toFixed(2)} $</p>
              </div>

              <button
                className={`btn w-100 ${courseData.status === 'ACCEPTEE' ? 'btn-outline-success' : 'btn-primary'}`}
                disabled={courseData.status !== 'ACCEPTEE'}
                onClick={goToChat}
              >
                {courseData.status === 'ACCEPTEE'
                  ? 'Contacter le chauffeur'
                  : 'En attente d’un chauffeur...'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InnerCourseRequestPage;
