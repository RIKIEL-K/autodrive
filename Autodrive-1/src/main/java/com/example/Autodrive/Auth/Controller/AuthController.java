package com.example.Autodrive.Auth.Controller;

import com.example.Autodrive.Auth.Service.LookupService;
import com.example.Autodrive.Auth.dto.LoginRequest;
import com.example.Autodrive.Utils.JwtUtil;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final LookupService lookup;
    private final JwtUtil jwt;
    private final PasswordEncoder encoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // LoginRequest: email, password, role
        LookupService.AuthRecord ar = lookup.findByEmailAndRole(req.getEmail(), req.getRole());

        // comparer mots de passe
        boolean ok = (encoder != null)
                ? encoder.matches(req.getPassword(), ar.getPassword())
                : Objects.equals(req.getPassword(), ar.getPassword());

        if (!ok) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Identifiants invalides"));

        String access = jwt.generateAccessToken(ar.getEmail(), ar.getRole(), ar.getId());
        String refresh = jwt.generateRefreshToken(ar.getEmail(), ar.getId());

        return ResponseEntity.ok(Map.of(
                "token", access,
                "refreshToken", refresh,
                "userId", ar.getId(),
                "firstname", ar.getFirstname(),
                "role", ar.getRole()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String rt = body.get("refreshToken");
        if (rt == null) return ResponseEntity.badRequest().body(Map.of("error", "refreshToken manquant"));

        try {
            var claims = jwt.parse(rt).getBody();
            String email = claims.getSubject();
            String uid = (String) claims.get("uid");
            // (Optionnel) retrouver le rôle actuel si besoin
            String newAccess = jwt.generateAccessToken(email, "UNKNOWN", uid);
            return ResponseEntity.ok(Map.of("token", newAccess));
        } catch (JwtException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Refresh invalide/expiré"));
        }
    }
}
