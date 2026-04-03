package com.example.legion.journalApp2.service;

import com.example.legion.journalApp2.config.SecurityConfig;
import com.example.legion.journalApp2.dto.request.ChangePasswordDTO;
import com.example.legion.journalApp2.dto.response.UserResponseDTO;
import com.example.legion.journalApp2.entity.User;
import com.example.legion.journalApp2.enums.Role;
import com.example.legion.journalApp2.exception.BadRequestException;
import com.example.legion.journalApp2.exception.ResourceNotFoundException;
import com.example.legion.journalApp2.mapper.UserMapper;
import com.example.legion.journalApp2.repository.JournalRepository;
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
    private final JournalRepository journalRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, JournalRepository journalRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.journalRepository = journalRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    //get current user
    public UserResponseDTO getCurrentUser(){
        String userName = getLoggedInUserName();
        User user = userRepository.findByUserName(userName).orElseThrow(
                () -> new ResourceNotFoundException("User not found.")
        );
        logger.debug("Fetching details for user: {}", userName);
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

    //delete User by self
    public void deleteCurrentUser(){
        String userName = getLoggedInUserName();
        User user = userRepository.findByUserName(userName).orElseThrow(
                () -> new ResourceNotFoundException("User not found.")
        );
        if(user.getRole() == Role.ROLE_ADMIN){
            throw new BadRequestException("Admin can't delete their own account.");
        }
        journalRepository.deleteByUserName(userName);
        userRepository.delete(user);
        logger.info("User deleted their own account: {}",userName);
    }

    //delete user by admin
    public void deleteUserByAdmin(String targetUserName){
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        if(currentUser.equals(targetUserName)){
            throw new BadRequestException("Admin can't delete themselves.");
        }
        User user = userRepository.findByUserName(targetUserName).orElseThrow( () -> {
            logger.warn("Admin tried to delete non-existing user. {}", targetUserName);
            return new ResourceNotFoundException("User not found.");
        });

        if(user.getRole() == Role.ROLE_ADMIN){
            throw new BadRequestException("Admin can't delete another admin.");
        }
        journalRepository.deleteByUserName(targetUserName);
        userRepository.delete(user);
        logger.info("Admin {} deleted user: {}",currentUser, targetUserName);
    }

    //get username
    public String getLoggedInUserName(){
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
