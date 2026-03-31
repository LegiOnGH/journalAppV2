package com.example.legion.journalApp2.service;

import com.example.legion.journalApp2.dto.request.JournalRequestDTO;
import com.example.legion.journalApp2.dto.request.JournalUpdateDTO;
import com.example.legion.journalApp2.dto.response.JournalResponseDTO;
import com.example.legion.journalApp2.entity.JournalEntry;
import com.example.legion.journalApp2.exception.ResourceNotFoundException;
import com.example.legion.journalApp2.mapper.JournalMapper;
import com.example.legion.journalApp2.repository.JournalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;
import java.util.List;

@Service
public class JournalService{

    private static final Logger logger = LoggerFactory.getLogger(JournalService.class);

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
        logger.info("Entry created by user: {}. Id: {}",saved.getUserName(), saved.getId());
        return journalMapper.toDTO(saved);
    }

    //get all entries
    public List<JournalResponseDTO> getAllEntries(){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.debug("Fetching entries for user: {}", userName);
        List<JournalEntry> entries = journalRepository.findByUserName(userName);
        return entries.stream().map(journalMapper::toDTO).toList();
    }

    //get entry by id
    public JournalResponseDTO getById(String id){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        JournalEntry entry = journalRepository.findById(id).orElseThrow(() -> {
            logger.warn("Journal with Id: {} not found.", id);
            return new ResourceNotFoundException("Journal not found.");
        });
        if(!entry.getUserName().equals(userName)){
            logger.warn("Unauthorized access attempt by user: {} for entry Id: {}", userName, id);
            throw new AccessDeniedException("Access Denied");
        }
        logger.info("Entry retrieved by user: {}. Id: {}", userName, id);
        return journalMapper.toDTO(entry);
    }

    //update entry
    public JournalResponseDTO updateEntry(String id, JournalUpdateDTO dto){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        JournalEntry entry = journalRepository.findById(id).orElseThrow(
                () -> {
                    logger.warn("Journal not found. Id: {}", id);
                    return new ResourceNotFoundException("Journal not found.");
                }
        );
        if(!entry.getUserName().equals(userName)){
            logger.warn("Unauthorized access attempt by user: {} for entry Id: {}", userName, id);
            throw new AccessDeniedException("Access Denied");
        }
        if(dto.getTitle() != null) entry.setTitle(dto.getTitle());
        if(dto.getContent() != null) entry.setContent(dto.getContent());
        if(dto.getSentiment() != null) entry.setSentiment(dto.getSentiment());
        JournalEntry updated = journalRepository.save(entry);
        logger.info("Entry updated by user: {}. Id: {} ", userName, id);
        return journalMapper.toDTO(updated);
    }

    //delete entry
    public void deleteEntry(String id){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        JournalEntry entry = journalRepository.findById(id).orElseThrow(
                () -> {
                    logger.warn("Journal not found. Id: {}", id);
                    return new ResourceNotFoundException("Journal not found.");
                }
        );
        if(!entry.getUserName().equals(userName)){
            logger.warn("Unauthorized access attempt by user: {} for entry Id: {}", userName, id);
            throw new AccessDeniedException("Access Denied");
        }
        logger.info("Entry deleted by user: {}. Id: {}", userName, id);
        journalRepository.delete(entry);
    }
}
