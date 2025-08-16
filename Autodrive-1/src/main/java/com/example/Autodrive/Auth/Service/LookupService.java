package com.example.Autodrive.Auth.Service;


import com.example.Autodrive.Driver.Repository.DriverRepository;
import com.example.Autodrive.User.Repository.UserRepository;
import com.example.Autodrive.service.PasswordService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class LookupService {
    private final DriverRepository driverRepo;
    private final UserRepository userRepo;

    public AuthRecord findByEmailAndRole(String email, String role) {
        String r = role.toUpperCase();
        return switch (r) {
            case "DRIVER" -> driverRepo.findByEmail(email)
                    .map(d -> new AuthRecord(d.getId(), d.getEmail(), d.getPassword(), "DRIVER", d.getFirstname()))
                    .orElseThrow(() -> new IllegalArgumentException("Driver introuvable"));
            default -> userRepo.findByEmail(email)
                    .map(u -> new AuthRecord(u.getId(), u.getEmail(), u.getPassword(), "USER", u.getFirstname()))
                    .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        };
    }

    @Getter @AllArgsConstructor
    public static class AuthRecord {
        private String id;
        private String email;
        private String password; // idéalement hashée BCrypt
        private String role;
        private String firstname;
    }

    public boolean passwordMatches(String raw, String stored, PasswordService encoder) {
        return encoder != null ? encoder.matches(raw, stored) : Objects.equals(raw, stored);
    }
}

