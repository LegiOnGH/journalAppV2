package com.example.legion.journalApp2.service;

import com.example.legion.journalApp2.dto.request.ChangePasswordDTO;
import com.example.legion.journalApp2.dto.response.UserResponseDTO;
import com.example.legion.journalApp2.entity.User;
import com.example.legion.journalApp2.exception.BadRequestException;
import com.example.legion.journalApp2.exception.ResourceNotFoundException;
import com.example.legion.journalApp2.mapper.UserMapper;
import com.example.legion.journalApp2.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

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
        return userMapper.toDTO(user);
    }

    //change password
    public void changePassword(ChangePasswordDTO dto){
        String userName = getLoggedInUserName();
        User user = userRepository.findByUserName(userName).orElseThrow(
                () -> new ResourceNotFoundException("User not found.")
        );

        if(!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())){
            throw new BadRequestException("Old password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    //get username
    public String getLoggedInUserName(){
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
