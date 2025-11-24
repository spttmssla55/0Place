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

     // 이름 변경
    public boolean updateUsername(String username, String name) {
        User user = userRepository.findByUsername(username);
        if (user == null) return false;
        user.setName(name);
        userRepository.save(user);
        return true;
    }

    // 비밀번호 변경
    public boolean changePassword(String username, String oldPass, String newPass) {
        User user = userRepository.findByUsername(username);
        if (user == null) return false;
        if (!user.getPassword().equals(oldPass)) return false;
        user.setPassword(newPass);
        userRepository.save(user);
        return true;
    }

    // 회원탈퇴
    public boolean deleteUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) return false;
        userRepository.delete(user);
        return true;
    }

}
