import React, { useEffect, useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { useParams } from 'react-router-dom'; 
import InnerCourseRequestPage from './InnerCourseRequestPage';
import Loading from '../../components/Loading';

const GOOGLE_API_KEY = 'AIzaSyAg4qOhqE5rG5XGn_-q16WVCN7pKWUJ170';
const libraries = ['places'];

const CourseRequestPage = () => {
  const [userPosition, setUserPosition] = useState(null);
  const { id } = useParams(); 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Erreur localisation :', error);
      }
    );
  }, []);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={libraries}>
      {userPosition
        ? <InnerCourseRequestPage userPosition={userPosition} userId={id} />
        : <Loading />}
    </LoadScript>
  );
};

export default CourseRequestPage;
