package com.example.viet.splitz.user.impl;

import com.example.viet.splitz.user.User;
import com.example.viet.splitz.user.UserRepository;
import com.example.viet.splitz.user.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void createNewUser(User user) {
        userRepository.save(user);
    }

    @Override
    public void deleteUserById(Long id) {
        User user = userRepository.getReferenceById(id);
        userRepository.delete(user);
    }
}
