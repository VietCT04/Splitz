package com.example.viet.splitz.user;


import com.example.viet.splitz.user.dtos.UserDashboardDto;
import org.springframework.security.core.Authentication;

public interface UserService {
    void createNewUser(User user);
    void deleteUserById(Long id);
    UserDashboardDto getUserDashboard(Authentication authentication);
}
