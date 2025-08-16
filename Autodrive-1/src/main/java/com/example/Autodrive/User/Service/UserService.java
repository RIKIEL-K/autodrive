package com.example.Autodrive.User.Service;


import com.example.Autodrive.Utils.JwtUtil;
import com.example.Autodrive.model.Compte;
import com.example.Autodrive.Enums.Role;
import com.example.Autodrive.model.Token;
import com.example.Autodrive.User.Model.User;
import com.example.Autodrive.repository.CompteRepository;
import com.example.Autodrive.repository.TokenRepository;
import com.example.Autodrive.User.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.Objects;

@RequiredArgsConstructor
@Service
// Un service implementant la logique pour la gestion des utilisateurs
public class UserService {
    private final UserRepository userRepository;
    private final CompteRepository compteRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenRepository tokenRepository;
    private final JwtUtil jwtUtil;


    // Méthode pour enregistrer un nouvel utilisateur
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà");
        }

        // Hachage du mot de passe
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        // Définition du rôle par défaut si non spécifié
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        // Enregistrement de l'utilisateur dans la base de données


        // Création du compte associé à cette utilisateur
        Compte compte = new Compte();
        compte.setUserId(user.getId());
        compte.setDateCreation(new Date());
        compte.setId_compte(generateCompteId());

        // Enregistrer le compte dans la base de données
        compteRepository.save(compte);
        return userRepository.save(user);
    }

    private String generateCompteId() {
        return "COMPTE-" + System.currentTimeMillis();
    }

    // Créer un token de réinitialisation du mot de passe
    public void createPasswordResetToken(User user, String token) {
        Token resetToken = new Token();
        resetToken.setUser(user);
        resetToken.setToken(token);
        tokenRepository.save(resetToken);
    }

    public Token findPasswordResetToken(String token) {
        return tokenRepository.findByToken(token);
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    /**
     * Sauvegarder la photo de profil
     */
    public String saveProfilePhoto(MultipartFile photo, String userId) {
        if (photo == null || photo.isEmpty()) {
            throw new IllegalArgumentException("Le fichier de la photo est vide ou manquant.");
        }
        String original = Objects.toString(photo.getOriginalFilename(), "photo");
        // Nettoyage simple du nom de fichier
        String sanitized = original.replaceAll("[^a-zA-Z0-9._-]", "_");
        String fileName = userId + "_" + sanitized;
        String uploadDir = "uploads/profile-photos"; // sans trailing slash
        Path uploadPath = Paths.get(uploadDir);
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path target = uploadPath.resolve(fileName);
            Files.copy(photo.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return uploadDir + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'enregistrement de la photo de profil", e);
        }
    }

    /**
     * Trouver un utilisateur par ID
     */
    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    /**
     * Supprimer un utilisateur
     */
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    // Connexion avec email et mot de passe
    public String loginUser(String email, String password) {
        System.out.println("[Auth][println] Login request received for email=" + email);
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            System.out.println("[Auth][println] Login failed: user not found for email=" + email);
            throw new IllegalArgumentException("Aucun utilisateur trouvé avec cet email.");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("[Auth][println] Login failed: bad password for userId=" + user.getId() + " email=" + email);
            throw new IllegalArgumentException("Mot de passe incorrect.");
        }
        // Génère un access token basé sur l'email (subject), le rôle et l'ID utilisateur
        String role = user.getRole() != null ? user.getRole().name() : "USER";
        String token = jwtUtil.generateAccessToken(user.getEmail(), role, user.getId());
        String prefix = token != null && token.length() >= 10 ? token.substring(0, 10) : (token == null ? "null" : token);
        System.out.println("[Auth][println] Access token generated for userId=" + user.getId() +
                " role=" + role + " len=" + (token != null ? token.length() : 0) +
                " prefix=" + prefix + "...");
        return token;
    }
}
