package com.example.Autodrive.service;


import com.example.Autodrive.model.Vehicule;
import com.example.Autodrive.repository.VehiculeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehiculeService {

    @Autowired
    private VehiculeRepository vehiculeRepository;

    @Autowired
    private DriverService conducteurService;

    public Vehicule enregistrerVehicule(Vehicule vehicule) {
        Vehicule savedVehicule = vehiculeRepository.save(vehicule);

        // Mise à jour du conducteur avec l'ID du véhicule
        conducteurService.getConducteurById(vehicule.getConducteurId()).ifPresent(c -> {
            c.setVehiculeId(savedVehicule.getId());
            conducteurService.updateConducteur(c);
        });

        return savedVehicule;
    }
    public List<Vehicule> getByConducteurId(String conducteurId) {
        return vehiculeRepository.findByConducteurId(conducteurId);
    }
}
