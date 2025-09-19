package com.example.viet.splitz.auth;

import com.example.viet.splitz.jwt.JwtService;
import com.example.viet.splitz.user.User;
import com.example.viet.splitz.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class AuthService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final AuthenticationManager authManager;

    public AuthService(UserRepository repo, PasswordEncoder encoder, JwtService jwt, AuthenticationManager am) {
        this.repo = repo; this.encoder = encoder; this.jwt = jwt; this.authManager = am;
    }

    public void signup(String username, String rawPassword) {
        if (repo.findByUsername(username).isPresent()) throw new IllegalArgumentException("Username taken");
        var u = new User();
        u.setName(username);
        u.setPassword(encoder.encode(rawPassword));
        repo.save(u);
    }

    public String login(String username, String password) {
        // Let Spring validate creds (will call UDS + PasswordEncoder)
        authManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        // If no exception → valid. Issue JWT using current authorities:
        var user = repo.findByUsername(username).orElseThrow();
        var principal = User.withUsername(user.getUsername())
                .password(user.getPasswordHash())
                .build();
        return jwt.issueAccess(principal.getUsername(), principal.getAuthorities());
    }
}
