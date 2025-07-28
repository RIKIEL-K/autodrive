
package com.example.Autodrive.controller;


import com.example.Autodrive.model.Voiture;
import com.example.Autodrive.service.VoitureService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/voitures")
@AllArgsConstructor

public class VoitureController {

    private final VoitureService voitureService;

    @PostMapping("/add")
    public ResponseEntity<?> ajouterVoiture(@RequestBody Voiture voiture) {
        System.out.println("Ajout de la voiture: " + voiture);
        try {
            Voiture saved = voitureService.ajouterVoiture(voiture);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> modifierVoiture(@PathVariable String id, @RequestBody Voiture voiture) {
        System.out.println("Modification de la voiture avec l'ID: " + id);
        try {
            Voiture updated = voitureService.modifierVoiture(id, voiture);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> supprimerVoiture(@PathVariable String id) {
        System.out.println("Suppression de la voiture avec l'ID: " + id);
        try {
            voitureService.supprimerVoiture(id);
            return ResponseEntity.ok("Voiture supprimée.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @GetMapping("/driver/{driverId}")
    public ResponseEntity<?> voirVoiture(@PathVariable String driverId) {
        try {
            Voiture voiture = voitureService.getVoitureByDriverId(driverId);
            return ResponseEntity.ok(voiture);
        } catch (RuntimeException e) {
            System.out.println("Voiture non trouvée pour le conducteur avec l'ID: " + driverId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

