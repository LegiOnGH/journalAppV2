package com.example.legion.journalApp2.service;

import com.example.legion.journalApp2.dto.request.ChangePasswordDTO;
import com.example.legion.journalApp2.dto.response.UserResponseDTO;
import com.example.legion.journalApp2.entity.User;
import com.example.legion.journalApp2.exception.BadRequestException;
import com.example.legion.journalApp2.exception.ResourceNotFoundException;
import com.example.legion.journalApp2.mapper.UserMapper;
import com.example.legion.journalApp2.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    //get current user
    public UserResponseDTO getCurrentUser(){
        String userName = getLoggedInUserName();
        User user = userRepository.findByUserName(userName).orElseThrow(
                () -> new ResourceNotFoundException("User not found.")
        );
        logger.info("Fetching details for user: {}", userName);
        return userMapper.toDTO(user);
    }

    //change password
    public void changePassword(ChangePasswordDTO dto){
        String userName = getLoggedInUserName();
        User user = userRepository.findByUserName(userName).orElseThrow(
                () -> {
                    logger.warn("User not found for username: {}", userName);
                    return new ResourceNotFoundException("User not found.");
                }
        );

        if(!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())){
            logger.warn("Incorrect old password attempt for user: {}.", userName);
            throw new BadRequestException("Old password is incorrect.");
        }
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        logger.info("Password changed for user: {}", userName);
        userRepository.save(user);
    }

    //get username
    public String getLoggedInUserName(){
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
