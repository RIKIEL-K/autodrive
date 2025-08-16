package com.example.Autodrive.controller;

import com.example.Autodrive.Auth.dto.LoginRequest;
import com.example.Autodrive.Requests.DriverStatusUpdateRequest;
import com.example.Autodrive.Driver.Model.Driver;
import com.example.Autodrive.Driver.Repository.DriverRepository;
import com.example.Autodrive.Driver.Service.DriverService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverService conducteurService;
    private final DriverRepository driverRepository;

    @PostMapping("/register")
    public ResponseEntity<Driver> register(@RequestBody Driver conducteur) {
        System.out.println("Conducteur reçu : " + conducteur);
        Driver saved = conducteurService.enregistrerConducteur(conducteur);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getById(@PathVariable String id) {
        return conducteurService.getConducteurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/en-ligne/{id}")
    public ResponseEntity<?> updateEnLigne(@PathVariable String id,
                                           @RequestBody DriverStatusUpdateRequest request) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Conducteur introuvable"));

        driver.setEnLigne(request.isEnLigne());

        if (request.isEnLigne() && request.getLatitude() != null && request.getLongitude() != null) {
            driver.setLocation(new GeoJsonPoint(request.getLongitude(), request.getLatitude()));
        }

        driverRepository.save(driver);
        return ResponseEntity.ok("Statut enLigne mis à jour");
    }

    @GetMapping("/{id}/has-car")
    public ResponseEntity<Boolean> hasCar(@PathVariable String id) {
        boolean hasCar = conducteurService.hasCar(id);
        if (!hasCar) {
            System.out.println("Le conducteur n'a pas de voiture associée.");
        }
        else {
            System.out.println("Le conducteur a une voiture associée.");
        }
        return ResponseEntity.ok(hasCar);
    }
}
