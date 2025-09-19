package com.example.viet.splitz.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private record AuthReq(String username, String password) {
    }

    private record TokenRes(String accessToken) {
    }

    private final AuthService svc;

    public AuthController(AuthService svc) {
        this.svc = svc;
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody AuthReq req) {
        svc.signup(req.username(), req.password());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<TokenRes> login(@RequestBody AuthReq req) {
        String token = svc.login(req.username(), req.password());
        return ResponseEntity.ok(new TokenRes(token));
    }

    // Useful for the frontend to test auth quickly
    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        return Map.of("username", auth.getName(),
                "authorities", auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());
    }
}