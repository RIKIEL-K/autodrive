package com.example.Autodrive.service;


import com.example.Autodrive.model.Course;
import com.example.Autodrive.Enums.CourseStatus;
import com.example.Autodrive.Driver.Model.Driver;
import com.example.Autodrive.User.Model.User;
import com.example.Autodrive.repository.CourseRepository;
import com.example.Autodrive.Driver.Repository.DriverRepository;

import com.example.Autodrive.User.Repository.UserRepository;
import com.example.Autodrive.repository.VoitureRepository;
import com.mongodb.client.model.geojson.Point;
import com.mongodb.client.model.geojson.Position;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepo;
    private final DriverRepository driverRepo;
    private final VoitureRepository voitureRepository;
    private final UserRepository userRepo;
    private final StripeService stripeService;

    private static final double RAYON_METRES = 1000;
    private static final double PRIX_PAR_KM = 5.0;

    public Course requestCourse(String userId, GeoJsonPoint depart, GeoJsonPoint destination) {

        double lat1 = depart.getY();
        double lon1 = depart.getX();
        double lat2 = destination.getY();
        double lon2 = destination.getX();

        double distanceKm = calculateDistanceKm(lat1, lon1, lat2, lon2);
        double prix = distanceKm * PRIX_PAR_KM;

        if (distanceKm <= 0) {
            System.out.println("Distance invalide, la course ne peut pas être créée.");
            return null;
        }
        if (prix <= 0) {
            System.out.println("Prix invalide, la course ne peut pas être créée.");
            return null;
        }
        if (prix > 0 && prix <= 5) {
            prix = 5;
        }

        Course course = new Course();
        course.setUserId(userId);
        course.setDepart(depart);
        course.setDestination(destination);
        course.setStatus(CourseStatus.EN_ATTENTE);
        course.setDistanceKm(distanceKm);
        course.setPrix(prix);
        course.setDate(LocalDateTime.now());

        courseRepo.save(course);
        // Tu reçois un GeoJsonPoint
        List<Double> coords = List.of(depart.getX(), depart.getY());
        Point pointForQuery = new Point(new Position(coords));

        List<Driver> drivers = driverRepo.findNearbyDrivers(pointForQuery, RAYON_METRES);
        if (drivers.isEmpty()) {
            System.out.println("Aucun chauffeur trouvé à proximité.");
            return null;
        }
        return course;
    }


    private double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // Rayon de la Terre en kilomètres
        double dlat = Math.toRadians(lat2 - lat1);
        double dlon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dlon / 2) * Math.sin(dlon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public List<Course> getCoursesForDriver(String driverId, double latitude, double longitude) {
        System.out.println("Récupération des courses pour le conducteur avec ID: " + driverId);
        double maxDistanceInMeters = 1000;
        return courseRepo.findPendingCoursesNear(longitude, latitude, maxDistanceInMeters);
    }

    public Course acceptCourse(String courseId, String driverId) throws StripeException {
        System.out.println("Accepting course with ID: " + courseId + " for driver: " + driverId);
        Course course = courseRepo.findById(courseId).orElseThrow();
        User user = userRepo.findById(course.getUserId()).orElseThrow();
        Driver driver = driverRepo.findById(driverId).orElseThrow();

        // Paiement immédiat
        long amountCents = (long) (course.getPrix() * 100);
        stripeService.processPayment(
                user.getStripeCustomerId(),
                driver.getStripeAccountId(),
                amountCents
        );

        driver.setSolde(driver.getSolde() + course.getPrix());
        user.setSolde(user.getSolde() - course.getPrix());

        // Mise à jour des soldes
        userRepo.save(user);
        driverRepo.save(driver);

        System.out.println("Solde du conducteur mis à jour: " + driver.getSolde());
        System.out.println("Solde de l'utilisateur mis à jour: " + user.getSolde());

        course.setDriverId(driverId);
        course.setStatus(CourseStatus.ACCEPTEE);
        return courseRepo.save(course);
    }

    public Course getLatestCourseStatus(String userId) {
        return courseRepo.findTopByUserIdOrderByDateDesc(userId).orElse(null);
    }

    public Course getByIdWithVoiture(String id) {
        Course course = courseRepo.findById(id).orElse(null);
        if (course != null && course.getDriverId() != null) {
            voitureRepository.findByDriverId(course.getDriverId()).ifPresent(voiture -> {
                course.setVehicule(voiture.getMarque() + " " + voiture.getModele() + " " + voiture.getAnnee());
                course.setPlaque(voiture.getNumeroDePlaque());
            });
        }
        return course;
    }
}

