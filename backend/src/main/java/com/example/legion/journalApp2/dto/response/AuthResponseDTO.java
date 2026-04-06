package com.example.legion.journalApp2.dto.response;

import com.example.legion.journalApp2.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private Role role;
}
