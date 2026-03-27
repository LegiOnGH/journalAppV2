package com.example.legion.journalApp2.dto.request;

import com.example.legion.journalApp2.enums.Sentiment;
import lombok.Data;

@Data
public class JournalUpdateDTO {

    private String title;

    private String content;

    private Sentiment sentiment;
}