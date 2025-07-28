package com.example.Autodrive.controller;


import com.example.Autodrive.model.User;
import com.example.Autodrive.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@AllArgsConstructor
@CrossOrigin

@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private final UserService userService;
    /**
     * Récupérer les informations du profil utilisateur
     * Correspond à l'affichage des données dans le formulaire
     */
    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getUserProfile(@PathVariable String id) {
        try {
            User user = userService.findById(id);
            if (user == null) {
                return ResponseEntity.status(404).body(null);
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * Mise à jour du profil utilisateur
     * Correspond au bouton "Enregistrer" et "modifier"
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateUserProfile(
            @PathVariable String id,
            @Valid @RequestBody User updatedUser) {
        try {
            User existingUser = userService.findById(id);
            if (existingUser == null) {
                return ResponseEntity.status(404).body("Utilisateur non trouvé");
            }

            // Mise à jour des informations personnelles
            existingUser.setFirstname(updatedUser.getFirstname());
            existingUser.setLastname(updatedUser.getLastname());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
            existingUser.setAddress(updatedUser.getAddress());

            userService.updateUser(existingUser);
            return ResponseEntity.ok("Profil mis à jour avec succès");

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Erreur lors de la mise à jour du profil : " + e.getMessage());
        }
    }

    /**
     * Mise à jour de la photo de profil
     * Correspond au bouton "Changer de photo"
     */
    @PutMapping("/update-photo/{id}")
    public ResponseEntity<String> updateProfilePhoto(
            @PathVariable String id,
            @RequestParam("photo") MultipartFile photo) {
        try {
            User user = userService.findById(id);
            if (user == null) {
                return ResponseEntity.status(404).body("Utilisateur non trouvé");
            }

            // Validation du fichier image
            if (photo.isEmpty()) {
                return ResponseEntity.status(400).body("Aucune photo sélectionnée");
            }

            // Vérifier le type de fichier (images uniquement)
            String contentType = photo.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(400)
                        .body("Le fichier doit être une image");
            }

            // Sauvegarder la photo et mettre à jour l'utilisateur
            String photoPath = userService.saveProfilePhoto(photo, id);
            user.setProfilePhoto(photoPath);
            userService.updateUser(user);

            return ResponseEntity.ok("Photo de profil mise à jour avec succès");

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Erreur lors de la mise à jour de la photo : " + e.getMessage());
        }
    }

    /**
     * Définir l'adresse par défaut
     * Correspond à la checkbox "Make this my default address"
     */
    @PutMapping("/set-default-address/{id}")
    public ResponseEntity<String> setDefaultAddress(
            @PathVariable String id,
            @RequestBody Map<String, String> addressData) {
        try {
            User user = userService.findById(id);
            if (user == null) {
                return ResponseEntity.status(404).body("Utilisateur non trouvé");
            }

            user.setAddress(addressData.get("address"));
            userService.updateUser(user);

            return ResponseEntity.ok("Adresse par défaut mise à jour");

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Erreur lors de la mise à jour de l'adresse : " + e.getMessage());
        }
    }

    /**
     * Suppression du compte utilisateur
     * Correspond au bouton "supprimer le compte"
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        try {
            User user = userService.findById(id);
            if (user == null) {
                return ResponseEntity.status(404).body("Utilisateur non trouvé");
            }

            userService.deleteUser(id);
            return ResponseEntity.ok("Compte supprimé avec succès");

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Erreur lors de la suppression du compte : " + e.getMessage());
        }
    }

    /**
     * Désactiver temporairement le compte (rendre invisible)
     * Correspond au toggle "Rendre votre compte invisible"
     */
    @PutMapping("/toggle-visibility/{id}")
    public ResponseEntity<String> toggleAccountVisibility(@PathVariable String id) {
        try {
            User user = userService.findById(id);
            if (user == null) {
                return ResponseEntity.status(404).body("Utilisateur non trouvé");
            }

            // Basculer la visibilité du compte
            boolean currentVisibility = user.isAccountVisible();
            user.setAccountVisible(!currentVisibility);
            userService.updateUser(user);

            String message = user.isAccountVisible() ?
                    "Compte rendu visible" : "Compte rendu invisible";

            return ResponseEntity.ok(message);

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Erreur lors du changement de visibilité : " + e.getMessage());
        }
    }

    /**
     * Annuler les modifications (reset du formulaire)
     * Correspond au bouton "Annuler"
     */
    @GetMapping("/reset-form/{id}")
    public ResponseEntity<User> resetUserForm(@PathVariable String id) {
        try {
            // Retourner les données originales de l'utilisateur
            User user = userService.findById(id);
            if (user == null) {
                return ResponseEntity.status(404).body(null);
            }
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
