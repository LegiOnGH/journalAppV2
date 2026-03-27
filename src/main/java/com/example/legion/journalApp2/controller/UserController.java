package com.example.legion.journalApp2.controller;

import com.example.legion.journalApp2.dto.request.ChangePasswordDTO;
import com.example.legion.journalApp2.dto.response.UserResponseDTO;
import com.example.legion.journalApp2.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(){
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PostMapping("/changePass")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDTO dto){
        userService.changePassword(dto);
        return ResponseEntity.ok("Password updated successfully.");
    }
}
