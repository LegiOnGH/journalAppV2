package com.example.legion.journalApp2.dto.request;

import com.example.legion.journalApp2.enums.Sentiment;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JournalRequestDTO {

    @NotBlank(message = "Title is required.")
    private String title;

    @NotBlank(message = "Content is required.")
    private String content;

    @NotNull(message = "Sentiment must be provided.")
    private Sentiment sentiment;
}
