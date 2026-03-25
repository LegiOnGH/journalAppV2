package com.example.legion.journalApp2.mapper;


import com.example.legion.journalApp2.dto.request.SignupRequestDTO;
import com.example.legion.journalApp2.dto.response.UserResponseDTO;
import com.example.legion.journalApp2.entity.User;

public class UserMapper {
    public static User toEntity(SignupRequestDTO dto){
        return User.builder()
                .userName(dto.getUserName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .build();
    }

    public static UserResponseDTO toDTO(User user){
        return new UserResponseDTO(
                user.getId(),
                user.getUserName(),
                user.getEmail()
        );
    }
}
