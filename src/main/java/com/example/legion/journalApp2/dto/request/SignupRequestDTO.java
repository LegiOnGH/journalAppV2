package com.example.legion.journalApp2.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignupRequestDTO {

    @NotBlank
    private String userName;

    @Email
    private String email;

    @NotBlank
    private String password;
}
