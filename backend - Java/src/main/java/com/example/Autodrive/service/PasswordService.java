package com.example.Autodrive.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String encode(String raw) { return encoder.encode(raw); }
    public boolean matches(String raw, String hashed) { return encoder.matches(raw, hashed); }
}
