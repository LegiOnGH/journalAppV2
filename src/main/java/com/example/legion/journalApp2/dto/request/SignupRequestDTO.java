package com.example.legion.journalApp2.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequestDTO {

    @NotBlank
    private String userName;

    @Email
    private String email;

    @NotBlank
    @Size(min = 5, max = 14)
    private String password;
}
