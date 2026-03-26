package com.example.legion.journalApp2.service;

import com.example.legion.journalApp2.dto.request.JournalRequestDTO;
import com.example.legion.journalApp2.dto.response.JournalResponseDTO;
import com.example.legion.journalApp2.entity.JournalEntry;
import com.example.legion.journalApp2.mapper.JournalMapper;
import com.example.legion.journalApp2.repository.JournalRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class JournalService {

    private final JournalRepository journalRepository;
    private final JournalMapper journalMapper;

    public JournalService(JournalRepository journalRepository, JournalMapper journalMapper){
        this.journalRepository = journalRepository;
        this.journalMapper = journalMapper;
    }

    //create entry
    public JournalResponseDTO createEntry(JournalRequestDTO dto){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        JournalEntry entry = journalMapper.toEntity(dto, userName);
        JournalEntry saved = journalRepository.save(entry);
        return journalMapper.toDTO(saved);
    }
}
