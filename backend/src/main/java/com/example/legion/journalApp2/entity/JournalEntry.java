package com.example.legion.journalApp2.entity;

import com.example.legion.journalApp2.enums.Sentiment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "journal_entries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntry {

    @Id
    private String id;

    private String title;
    private String content;
    private Sentiment sentiment;
    private String userName;
    private LocalDateTime createdAt;

}
