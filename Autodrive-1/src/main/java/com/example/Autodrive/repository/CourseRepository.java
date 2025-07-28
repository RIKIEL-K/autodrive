package com.example.Autodrive.repository;

import com.example.Autodrive.model.Course;
import com.example.Autodrive.model.CourseStatus;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.bson.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByUserId(String userId);

    List<Course> findByDriverId(String driverId);

    Optional<Course> findTopByUserIdOrderByDateDesc(String userId);

    @Query("{ 'status': 'EN_ATTENTE', 'depart': { $nearSphere: { $geometry: { type: 'Point', coordinates: [?0, ?1] }, $maxDistance: ?2 } } }")
    List<Course> findPendingCoursesNear(double longitude, double latitude, double maxDistanceInMeters);

}