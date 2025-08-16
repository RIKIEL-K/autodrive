package com.example.Autodrive.Driver.Repository;

import com.example.Autodrive.Driver.Model.Driver;
import com.mongodb.client.model.geojson.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends MongoRepository<Driver, String> {
    Optional<Driver> findByEmail(String email);
    boolean existsByEmail(String email);

    // Rechercher les chauffeurs en ligne à proximité d'un point donné
    @Query("{ 'enLigne': true, 'location': { $nearSphere: { $geometry: ?0, $maxDistance: ?1 } } }") //
    List<Driver> findNearbyDrivers(Point point, double maxDistanceInMeters);

}
