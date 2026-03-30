package com.example.legion.journalApp2.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequestDTO {

        @NotBlank(message = "Username is required.")
        private String userName;

        @NotBlank(message = "Email is required.")
        @Email(message = "Enter a valid email address.")
        private String email;

        @NotBlank(message = "Password is required.")
        @Size(min = 5, max = 14, message = "Password must be between 5 and 14 characters.")
        private String password;
}
