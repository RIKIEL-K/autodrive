package com.example.Autodrive.service;

import com.example.Autodrive.composants.JwtUtil;
import com.example.Autodrive.model.Compte;
import com.example.Autodrive.model.Role;
import com.example.Autodrive.model.Token;
import com.example.Autodrive.model.User;
import com.example.Autodrive.repository.CompteRepository;
import com.example.Autodrive.repository.TokenRepository;
import com.example.Autodrive.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@AllArgsConstructor
@Service
// Un service implementant la logique pour la gestion des utilisateurs
public class UserService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final CompteRepository compteRepository;
    private PasswordEncoder passwordEncoder;
    private TokenRepository tokenRepository;
    @Autowired
    private JwtUtil jwtUtil;


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
        return userRepository.findByEmail(email);
    }

    /**
     * Sauvegarder la photo de profil
     */
    public String saveProfilePhoto(MultipartFile photo, String userId) {
        // Logique pour sauvegarder le fichier photo
        // Retourner le chemin de la photo sauvegardée
        String uploadDir = "uploads/profile-photos/";
        String fileName = userId + "_" + photo.getOriginalFilename();
        // Implémentation de la sauvegarde...
        return uploadDir + fileName;
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
        User user = userRepository.findByEmail(email);
        if (user == null) throw new IllegalArgumentException("Aucun utilisateur trouvé avec cet email.");
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Mot de passe incorrect.");
        }
        return jwtUtil.generateToken(user);
    }

}
