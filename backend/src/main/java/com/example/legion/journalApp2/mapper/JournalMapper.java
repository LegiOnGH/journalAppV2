package com.example.legion.journalApp2.mapper;

import com.example.legion.journalApp2.dto.request.JournalRequestDTO;
import com.example.legion.journalApp2.dto.response.JournalAdminResponseDTO;
import com.example.legion.journalApp2.dto.response.JournalResponseDTO;
import com.example.legion.journalApp2.entity.JournalEntry;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class JournalMapper {

    public JournalEntry toEntity(JournalRequestDTO dto, String userName){
        return JournalEntry.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .sentiment(dto.getSentiment())
                .userName(userName)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public JournalResponseDTO toDTO(JournalEntry entry){
        return JournalResponseDTO.builder()
                .id(entry.getId())
                .title(entry.getTitle())
                .content(entry.getContent())
                .sentiment(entry.getSentiment())
                .createdAt(entry.getCreatedAt())
                .build();
    }

    public JournalAdminResponseDTO toAdminDTO(JournalEntry entry){
        return JournalAdminResponseDTO.builder()
                .id(entry.getId())
                .userName(entry.getUserName())
                .title(entry.getTitle())
                .content(entry.getContent())
                .sentiment(entry.getSentiment())
                .createdAt(entry.getCreatedAt())
                .build();
    }
}
