package com.example.Autodrive.service;

import com.example.Autodrive.model.Voiture;
import com.example.Autodrive.repository.VoitureRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class VoitureService {

    private final VoitureRepository voitureRepository;

    // Ajouter une voiture (si aucune voiture n'existe déjà pour ce driver)
    public Voiture ajouterVoiture(Voiture voiture) {
        if (voitureRepository.existsByDriverId(voiture.getDriverId())) {
            throw new IllegalArgumentException("Le conducteur possède déjà un véhicule.");
        }
        return voitureRepository.save(voiture);
    }

    // Modifier une voiture existante
    public Voiture modifierVoiture(String id, Voiture nouvelleVoiture) {
        Voiture existante = voitureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voiture non trouvée."));
        nouvelleVoiture.setId(id);
        return voitureRepository.save(nouvelleVoiture);
    }

    // Supprimer une voiture
    public void supprimerVoiture(String id) {
        if (!voitureRepository.existsById(id)) {
            throw new RuntimeException("Aucune voiture à supprimer.");
        }
        voitureRepository.deleteById(id);
    }

    // Voir la voiture du driver
    public Voiture getVoitureByDriverId(String driverId) {
        return voitureRepository.findByDriverId(driverId)
                .orElseThrow(() -> new RuntimeException("Aucune voiture trouvée."));
    }
}

