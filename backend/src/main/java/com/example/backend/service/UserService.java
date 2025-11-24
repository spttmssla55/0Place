package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(String username, String password, String name) throws Exception {
        if (userRepository.existsByUsername(username)) {
            throw new Exception("이미 사용중인 아이디입니다.");
        }
        User newUser = new User(username, password, name);
        return userRepository.save(newUser);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public User login(String username, String password) throws Exception {
        User user = userRepository.findByUsername(username);
        if (user == null || !user.getPassword().equals(password)) {
            throw new Exception("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        return user;
    }

}
