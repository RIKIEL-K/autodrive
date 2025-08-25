package com.example.Autodrive.Utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    @Value("${app.jwt.secret}") private String secret;
    @Value("${app.jwt.access-exp-min}") private long accessExpMin;
    @Value("${app.jwt.refresh-exp-days}") private long refreshExpDays;

    private Key key() { return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }

    public String generateAccessToken(String subject, String role, String userId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(subject) // email
                .claim("role", role)
                .claim("uid", userId)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(accessExpMin, ChronoUnit.MINUTES)))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(String subject, String userId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(subject)
                .claim("uid", userId)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(refreshExpDays, ChronoUnit.DAYS)))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token);
    }
}
