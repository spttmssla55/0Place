package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
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
   // 이름 변경
    @PostMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UpdateUserRequest req) {
        boolean success = userService.updateUsername(req.getUsername(), req.getName());
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이름 변경 실패");
        }
    }

    // 비밀번호 변경
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest req) {
        boolean success = userService.changePassword(
            req.getUsername(), req.getOldPassword(), req.getNewPassword());
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호 변경 실패");
        }
    }

    // 회원탈퇴
    @PostMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestBody DeleteUserRequest req) {
        boolean success = userService.deleteUser(req.getUsername());
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원 탈퇴 실패");
        }
    }
}