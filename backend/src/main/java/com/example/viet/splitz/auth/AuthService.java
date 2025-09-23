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

    public void signup(String name, String rawPassword) {
        if (repo.findByName(name).isPresent()) throw new IllegalArgumentException("Username taken");
        User u = new User();
        u.setName(name);
        u.setPassword(encoder.encode(rawPassword));
        repo.save(u);
    }

    public String login(String name, String password) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(name, password));
        var user = repo.findByName(name).orElseThrow();
        var principal = org.springframework.security.core.userdetails.User.withUsername(user.getName())
                .password(user.getPassword())
                .build();
        return jwt.issueAccess(principal.getUsername());
    }
}
