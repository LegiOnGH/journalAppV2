package com.example.legion.journalApp2.service;

import com.example.legion.journalApp2.dto.request.LoginRequestDTO;
import com.example.legion.journalApp2.dto.request.SignupRequestDTO;
import com.example.legion.journalApp2.dto.response.AuthResponseDTO;
import com.example.legion.journalApp2.dto.response.UserResponseDTO;
import com.example.legion.journalApp2.entity.User;
import com.example.legion.journalApp2.mapper.UserMapper;
import com.example.legion.journalApp2.repository.UserRepository;
import com.example.legion.journalApp2.security.JwtUtil;
import org.apache.coyote.BadRequestException;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private final UserMapper userMapper;

    public AuthService(PasswordEncoder passwordEncoder, JwtUtil jwtUtil, UserMapper userMapper) {
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userMapper = userMapper;
    }

    public UserResponseDTO signup(@NotNull SignupRequestDTO requestDTO) throws BadRequestException {
        Optional<User> existingUser = userRepository.findByUserName(requestDTO.getUserName());
        if(existingUser.isPresent()){
            throw new BadRequestException("Username already exits.");
        }
        User user = userMapper.toEntity(requestDTO);
        user.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }
    public AuthResponseDTO login(@NotNull LoginRequestDTO requestDTO) throws BadCredentialsException{
        User user = userRepository.findByUserName(requestDTO.getUserName())
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password."));
        if(!passwordEncoder.matches(requestDTO.getPassword(), user.getPassword())){
            throw new BadCredentialsException("Invalid username or password.");
        }
        String token = jwtUtil.generateToken(user.getUserName());
        return new AuthResponseDTO(token);
    }
}
