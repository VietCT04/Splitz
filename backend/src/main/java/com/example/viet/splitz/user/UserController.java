package com.example.viet.splitz.user;

import com.example.viet.splitz.user.dtos.UserDashboardDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.awt.desktop.SystemSleepEvent;

@RestController
@RequestMapping("/user")
public class UserController {
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<String> createNewUser(@RequestBody User user){
        userService.createNewUser(user);
        return ResponseEntity.ok("Create New User Succeeded");
    }

    @GetMapping("/dashboard")
    public ResponseEntity<UserDashboardDto> getUserDashboard(Authentication authentication){
        return ResponseEntity.ok(userService.getUserDashboard(authentication));
    }

    @PostMapping("/delete")
    public ResponseEntity<String> createNewUser(@RequestBody Long id){
        System.out.println(id);
        userService.deleteUserById(id);
        return ResponseEntity.ok("Delete User Succeeded");
    }
}
