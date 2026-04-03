package com.example.legion.journalApp2.dto.response;

import com.example.legion.journalApp2.enums.Sentiment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JournalAdminResponseDTO {

    private String id;
    private String userName;
    private String title;
    private String content;
    private Sentiment sentiment;
    private LocalDateTime createdAt;

}
