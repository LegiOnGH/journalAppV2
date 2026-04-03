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
        logger.debug("Fetching current user details.");
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PostMapping("/changePass")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDTO dto){
        logger.info("Password change request received.");
        userService.changePassword(dto);
        return ResponseEntity.ok("Password updated successfully.");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(){
        logger.info("Delete user request initiated.");
        userService.deleteCurrentUser();
        return ResponseEntity.ok("User deleted successfully.");
    }
}
