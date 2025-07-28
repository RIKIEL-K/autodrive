package com.example.Autodrive.controller;

import com.example.Autodrive.DTO.LoginRequest;
import com.example.Autodrive.model.Token;
import com.example.Autodrive.model.User;
import com.example.Autodrive.repository.TokenRepository;
import com.example.Autodrive.service.MailService;
import com.example.Autodrive.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


@AllArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/auth")
public class AuthentificationController {
    @Autowired
    private final UserService userService;
    @Autowired
    private MailService mailService;
    @Autowired
    private TokenRepository tokenRepository;


    @GetMapping("/checkHealth")
    public ResponseEntity<String> checkHealth() {
        return ResponseEntity.ok("Service is up and running");
    }

    // Endpoint pour enregistrer un nouvel utilisateur
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) { //@RequestBody pour lier l'objet JSON envoyé dans la requête au paramètre user
        System.out.println("Tentative d'enregistrement de l'utilisateur : " + user.getEmail());
        try {
            User savedUser = userService.registerUser(user); // Appel de la méthode registerUser du service pour enregistrer l'utilisateur
            return ResponseEntity.ok(savedUser.getId());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de l'enregistrement de l'utilisateur : " + e.getMessage());
        }
    }

    // Demande de réinitialisation du mot de passe
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> payload) { //RequestParam pour récupérer le paramètre email de la requête sous forme de chaîne de caractères
        String email = payload.get("email");
        // Vérification si l'utilisateur existe
        User user = userService.findByEmail(email);
        if (user == null) {

            return ResponseEntity.status(400).body("Email not found");
        }

        // Vérifier si un token existe déjà pour cet utilisateur
        Token existingToken = tokenRepository.findByUser(user);
        if (existingToken != null) {
            return ResponseEntity.status(400).body("A password reset request has already been sent to this email.");
        }

        // Générer un token pour la réinitialisation
        String token = UUID.randomUUID().toString();
        userService.createPasswordResetToken(user, token);

        // Envoyer un email avec le lien de réinitialisation
        mailService.sendResetPasswordEmail(email, token);

        return ResponseEntity.ok("Password reset email sent.");
    }

    @PostMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");

        Token resetToken = userService.findPasswordResetToken(token);

        if (resetToken == null) {
            return ResponseEntity.status(400).body("Token invalide ou expiré.");
        }

        return ResponseEntity.ok("Token valide.");
    }

    @PostMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("newPassword");

        Token resetToken = userService.findPasswordResetToken(token);

        if (resetToken == null) {
            return ResponseEntity.status(400).body("Token invalide.");
        }

        User user = resetToken.getUser();

        // Hachage du mot de passe
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(newPassword);

        user.setPassword(hashedPassword);
        userService.updateUser(user);


        return ResponseEntity.ok("Mot de passe mis à jour avec succès.");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody LoginRequest loginRequest) {
        System.out.println("Tentative de connexion : " + loginRequest.getEmail());
        try {
            String token = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            User user = userService.findByEmail(loginRequest.getEmail());

            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", user.getId());
            response.put("firstname", user.getFirstname());
            response.put("role", user.getRole().toString());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Échec de la connexion : " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Erreur serveur : " + e.getMessage()));
        }
    }



}
