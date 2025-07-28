package com.example.Autodrive.controller;


import com.example.Autodrive.Requests.CourseRequestDTO;
import com.example.Autodrive.Requests.DriverStatusUpdateRequest;
import com.example.Autodrive.model.Course;
import com.example.Autodrive.model.Driver;
import com.example.Autodrive.repository.CourseRepository;
import com.example.Autodrive.repository.DriverRepository;
import com.example.Autodrive.service.CourseService;
import com.mongodb.client.model.geojson.Point;
import com.mongodb.client.model.geojson.Position;
import lombok.AllArgsConstructor;
import org.springframework.boot.origin.Origin;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Autodrive.model.CourseStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final DriverRepository driverRepository;
    private final CourseRepository courseRepository;

    @PostMapping("/request")
    public ResponseEntity<?> requestCourse(@RequestBody CourseRequestDTO dto) {
        GeoJsonPoint depart = new GeoJsonPoint(dto.getDepart().getLongitude(), dto.getDepart().getLatitude());
        GeoJsonPoint destination = new GeoJsonPoint(dto.getDestination().getLongitude(), dto.getDestination().getLatitude());

        Course course = courseService.requestCourse(dto.getUserId(), depart, destination);

        if (course == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Aucun chauffeur trouvé à proximité.");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.ok(course);
    }



    @GetMapping("/for-driver/{driverId}")
    public ResponseEntity<List<Course>> getCoursesForDriver(
            @PathVariable String driverId,
            @RequestParam double latitude,
            @RequestParam double longitude) {

        List<Course> courses = courseService.getCoursesForDriver(driverId, latitude, longitude);
        return ResponseEntity.ok(courses);
    }

    @PutMapping("/accept/{id}")
    public ResponseEntity<Course> acceptCourse(@PathVariable String id,
                                               @RequestParam String driverId) {
        return ResponseEntity.ok(courseService.acceptCourse(id, driverId));
    }
    @GetMapping("/status/{userId}")
    public ResponseEntity<Course> getStatus(@PathVariable String userId) {
        return ResponseEntity.ok(courseService.getLatestCourseStatus(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getByIdWithVoiture(@PathVariable String id) {
        Course course = courseService.getByIdWithVoiture(id);

        return course != null ? ResponseEntity.ok(course) : ResponseEntity.notFound().build();
    }

    @GetMapping("/driver/{driverId}/all")
    public ResponseEntity<List<Course>> getAcceptedCoursesByDriver(@PathVariable String driverId) {
        try {
            System.out.println("Fetching accepted courses for driver: " + driverId);
            List<Course> courses = courseRepository.findByDriverId(driverId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            System.err.println("Error fetching courses for driver: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<String> markCourseAsCompleted(@PathVariable String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course non trouvée"));

        course.setStatus(CourseStatus.TERMINEE);
        courseRepository.save(course);

        return ResponseEntity.ok("Course marquée comme terminée.");
    }

    @PutMapping("/{id}/arret")
    public ResponseEntity<String> signalerArret(@PathVariable String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course non trouvée"));
        System.out.println("Signalement d'arrêt pour la course avec ID: " + id);
        course.setStatus(CourseStatus.ARRET_SIGNALE);
        courseRepository.save(course);
        return ResponseEntity.ok("Arrêt signalé.");
    }


    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable String id) {
        return ResponseEntity.ok(courseRepository.findById(id).orElseThrow());
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<Course> getLatestCourseByUser(@PathVariable String userId) {
        System.out.println("Recherche de la dernière course pour userId : " + userId);
        Course course = courseRepository.findTopByUserIdOrderByDateDesc(userId)
                .orElseThrow(() -> {
                    System.err.println("Aucune course trouvée pour userId : " + userId);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND);
                });
        return ResponseEntity.ok(course);
    }



}
