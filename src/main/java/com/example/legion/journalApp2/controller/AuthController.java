package com.example.legion.journalApp2.controller;

import com.example.legion.journalApp2.dto.request.LoginRequestDTO;
import com.example.legion.journalApp2.dto.request.SignupRequestDTO;
import com.example.legion.journalApp2.dto.response.AuthResponseDTO;
import com.example.legion.journalApp2.dto.response.UserResponseDTO;
import com.example.legion.journalApp2.exception.BadRequestException;
import com.example.legion.journalApp2.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponseDTO> signup(@RequestBody @Valid SignupRequestDTO requestDTO){
        logger.info("Signup API called for username: {}.", requestDTO.getUserName());
        UserResponseDTO response = authService.signup(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid LoginRequestDTO requestDTO){
        logger.info("Login API called for username: {}.", requestDTO.getUserName());
        return ResponseEntity.ok(authService.login(requestDTO));
    }
}
