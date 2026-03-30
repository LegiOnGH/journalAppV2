package com.example.legion.journalApp2.controller;

import com.example.legion.journalApp2.dto.request.ChangePasswordDTO;
import com.example.legion.journalApp2.dto.response.UserResponseDTO;
import com.example.legion.journalApp2.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(){
        logger.info("Get current user API called.");
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PostMapping("/changePass")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDTO dto){
        logger.info("Change password API called.");
        userService.changePassword(dto);
        return ResponseEntity.ok("Password updated successfully.");
    }
}
