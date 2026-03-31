package com.example.legion.journalApp2.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDTO {
    private String id;
    private String userName;
    private String email;
}
