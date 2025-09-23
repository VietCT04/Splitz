package com.example.viet.splitz.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;
    private final long accessMinutes;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-minutes}") long accessMinutes) {

        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessMinutes = accessMinutes;
    }

    public String issueAccess(String name) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(name)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessMinutes, ChronoUnit.MINUTES)))
                .signWith(key)
                .compact();
    }

    public io.jsonwebtoken.Claims parse(String jwt) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(jwt)
                    .getPayload();
        } catch (SignatureException e) {
            throw e;
        }
    }
}
