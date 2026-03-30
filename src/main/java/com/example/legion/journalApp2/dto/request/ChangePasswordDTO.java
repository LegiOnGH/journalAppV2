package com.example.legion.journalApp2.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordDTO {
    @NotBlank(message = "Old password required.")
    private String oldPassword;

    @NotBlank(message = "New password required.")
    @Size(min=5, max=14, message = "Password must be between 5-14 characters.")
    private String newPassword;
}
