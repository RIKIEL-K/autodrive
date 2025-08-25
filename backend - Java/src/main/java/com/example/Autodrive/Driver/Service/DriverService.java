package com.example.Autodrive.Driver.Service;


import com.example.Autodrive.model.Compte;
import com.example.Autodrive.Driver.Model.Driver;
import com.example.Autodrive.Enums.Role;
import com.example.Autodrive.repository.CompteRepository;
import com.example.Autodrive.Driver.Repository.DriverRepository;
import com.example.Autodrive.repository.VoitureRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@AllArgsConstructor
public class DriverService {

    @Autowired
    private DriverRepository conducteurRepository;
    private VoitureRepository voitureRepository;
    private final PasswordEncoder passwordEncoder;
    private final CompteRepository compteRepository;

    public Driver enregistrerConducteur(Driver conducteur) {
        if (conducteurRepository.existsByEmail(conducteur.getEmail())) {
            throw new IllegalArgumentException("Un conducteur avec cet email existe déjà");
        }

        // Hachage du mot de passe
        String hashedPassword = passwordEncoder.encode(conducteur.getPassword());
        conducteur.setPassword(hashedPassword);

        // Attributs supplémentaires
        conducteur.setRole(Role.DRIVER);
        conducteur.setCreatedAt(new Date());
        conducteur.setEnLigne(false);

        // Sauvegarde du conducteur pour obtenir l'ID
        Driver savedDriver = conducteurRepository.save(conducteur);

        // Création du compte associé
        Compte compte = new Compte();
        compte.setUserId(savedDriver.getId());
        compte.setDateCreation(new Date());
        compte.setId_compte(generateCompteId());

        // Sauvegarde du compte
        compteRepository.save(compte);

        return savedDriver;
    }

    private String generateCompteId() {
        return "COMPTE-D-" + System.currentTimeMillis();
    }

    public Optional<Driver> getConducteurById(String id) {
        return conducteurRepository.findById(id);
    }

    public Driver updateConducteur(Driver conducteur) {
        return conducteurRepository.save(conducteur);
    }

    /**
     * Authentifie un conducteur en vérifiant son email et son mot de passe.
     *
     * @param email    L'email du conducteur.
     * @param password Le mot de passe du conducteur.
     * @return Le conducteur authentifié.
     * @throws IllegalArgumentException Si l'email n'existe pas ou si le mot de passe est incorrect.
     */
    public Driver loginDriver(String email, String password) {
        Driver driver = conducteurRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Aucun conducteur avec cet email"));
        // Vérification du mot de passe
        if (!passwordEncoder.matches(password, driver.getPassword())) {
            throw new IllegalArgumentException("Mot de passe incorrect");
        }

        return driver;
    }

    public boolean hasCar(String driverId) {
        return voitureRepository.existsByDriverId(driverId);
    }


}
