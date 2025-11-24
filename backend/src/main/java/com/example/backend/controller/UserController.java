package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) throws Exception {
        return userService.registerUser(user.getUsername(), user.getPassword(), user.getName());
    }

    @GetMapping("/check-username")
    public boolean checkUsername(@RequestParam String username) {
        return !userService.existsByUsername(username);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest loginRequest) throws Exception {
        return userService.login(loginRequest.getUsername(), loginRequest.getPassword());
    }

}
