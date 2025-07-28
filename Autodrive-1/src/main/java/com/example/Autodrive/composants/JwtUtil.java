package com.example.Autodrive.composants;

import com.example.Autodrive.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
// cette classe permet de creer le token lorsqu'il va se connecter et l'enregistrer dans une session
public class JwtUtil {
    // Clé secrète (minimum 32 caractères pour HS256)
    private static final String SECRET_KEY = "MaCleJWTultraSecreteDe32Caracteres!";

    // Génère une clé cryptographique à partir de la chaîne
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

    // Génére un JWT pour un utilisateur
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId()) // on peut utiliser user.getId() pour l'authentification
                .claim("email", user.getEmail())
                .claim("role", user.getRole().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 30000 )) // 30 seconds d'expiration
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extrait l'identifiant utilisateur (le "subject") du token
    public String extractUserId(String token) {
        return getClaims(token).getSubject();
    }

    // Vérifie si le token est encore valide
    public boolean validateToken(String token) {
        try {
            return !getClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    // Extrait les données (claims) du token
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}