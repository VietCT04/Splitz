package com.example.viet.splitz.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Date;

@Service
public class JwtService {
    private final Key key;
    private final long accessMinutes;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.access-minutes}") long accessMinutes) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessMinutes = accessMinutes;
    }

    public String issueAccess(String username, Collection<? extends GrantedAuthority> auths) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(username)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessMinutes, ChronoUnit.MINUTES)))
                .signWith(key)
                .compact();
    }

    public Jws<Claims> parse(String jwt) {
        return Jwts.parser().setSigningKey(key).build().parseClaimsJws(jwt);
    }
}