package com.example.legion.journalApp2.service;

import com.example.legion.journalApp2.dto.request.SignupRequestDTO;
import com.example.legion.journalApp2.dto.response.UserResponseDTO;
import com.example.legion.journalApp2.entity.User;
import com.example.legion.journalApp2.mapper.UserMapper;
import com.example.legion.journalApp2.repository.UserRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserResponseDTO signup(SignupRequestDTO request) throws BadRequestException {
        Optional<User> existingUser = userRepository.findByUserName(request.getUserName());
        if(existingUser.isPresent()){
            throw new BadRequestException("Username already exits.");
        }
        User user = UserMapper.toEntity(request);
        User savedUser = userRepository.save(user);
        return UserMapper.toDTO(savedUser);
    }
}
