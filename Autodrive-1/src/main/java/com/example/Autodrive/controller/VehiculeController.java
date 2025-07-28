package com.example.Autodrive.controller;

import com.example.Autodrive.model.Vehicule;
import com.example.Autodrive.service.VehiculeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicules")
public class VehiculeController {

    @Autowired
    private VehiculeService vehiculeService;

    @PostMapping("/register")
    public ResponseEntity<Vehicule> register(@RequestBody Vehicule vehicule) {
        Vehicule saved = vehiculeService.enregistrerVehicule(vehicule);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/conducteur/{conducteurId}")
    public ResponseEntity<List<Vehicule>> getByConducteur(@PathVariable String conducteurId) {
        return ResponseEntity.ok(vehiculeService.getByConducteurId(conducteurId));
    }
}
