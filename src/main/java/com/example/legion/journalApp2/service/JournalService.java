package com.example.legion.journalApp2.service;

import com.example.legion.journalApp2.dto.request.JournalRequestDTO;
import com.example.legion.journalApp2.dto.request.JournalUpdateDTO;
import com.example.legion.journalApp2.dto.response.JournalResponseDTO;
import com.example.legion.journalApp2.entity.JournalEntry;
import com.example.legion.journalApp2.exception.ResourceNotFoundException;
import com.example.legion.journalApp2.mapper.JournalMapper;
import com.example.legion.journalApp2.repository.JournalRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import java.util.List;

@Service
public class JournalService{

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

    //get all entries
    public List<JournalResponseDTO> getAllEntries(){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        List<JournalEntry> entries = journalRepository.findByUserName(userName);
        return entries.stream().map(journalMapper::toDTO).toList();
    }

    //get entry by id
    public JournalResponseDTO getById(String id){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        JournalEntry entry = journalRepository.findById(id).orElseThrow(() ->
            new ResourceNotFoundException("Journal not found.")
        );
        if(!entry.getUserName().equals(userName)){
            throw new AccessDeniedException("Access Denied");
        }
        return journalMapper.toDTO(entry);
    }

    //update entry
    public JournalResponseDTO updateEntry(String id, JournalUpdateDTO dto){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        JournalEntry entry = journalRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Journal not found.")
        );
        if(!entry.getUserName().equals(userName)){
            throw new AccessDeniedException("Access Denied");
        }
        if(dto.getTitle() != null) entry.setTitle(dto.getTitle());
        if(dto.getContent() != null) entry.setContent(dto.getContent());
        if(dto.getSentiment() != null) entry.setSentiment(dto.getSentiment());
        JournalEntry updated = journalRepository.save(entry);
        return journalMapper.toDTO(updated);
    }

    //delete entry
    public void deleteEntry(String id){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        JournalEntry entry = journalRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Journal not found.")
        );
        if(!entry.getUserName().equals(userName)){
            throw new AccessDeniedException("Access Denied");
        }
        journalRepository.delete(entry);
    }
}
