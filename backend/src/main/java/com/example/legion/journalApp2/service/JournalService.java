package com.example.legion.journalApp2.service;

import com.example.legion.journalApp2.dto.request.JournalRequestDTO;
import com.example.legion.journalApp2.dto.request.JournalUpdateDTO;
import com.example.legion.journalApp2.dto.response.JournalAdminResponseDTO;
import com.example.legion.journalApp2.dto.response.JournalResponseDTO;
import com.example.legion.journalApp2.dto.response.PageResponse;
import com.example.legion.journalApp2.entity.JournalEntry;
import com.example.legion.journalApp2.enums.Sentiment;
import com.example.legion.journalApp2.exception.ResourceNotFoundException;
import com.example.legion.journalApp2.mapper.JournalMapper;
import com.example.legion.journalApp2.repository.JournalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.util.ArrayList;
import java.util.List;

@Service
public class JournalService {

    private static final Logger logger = LoggerFactory.getLogger(JournalService.class);

    private final JournalRepository journalRepository;
    private final JournalMapper journalMapper;
    private final MongoTemplate mongoTemplate;

    public JournalService(JournalRepository journalRepository, JournalMapper journalMapper, MongoTemplate mongoTemplate) {
        this.journalRepository = journalRepository;
        this.journalMapper = journalMapper;
        this.mongoTemplate = mongoTemplate;
    }

    //create entry
    public JournalResponseDTO createEntry(JournalRequestDTO dto) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        JournalEntry entry = journalMapper.toEntity(dto, userName);
        JournalEntry saved = journalRepository.save(entry);
        logger.info("Entry created by user: {}. Id: {}", saved.getUserName(), saved.getId());
        return journalMapper.toDTO(saved);
    }

    //get all entries
    public PageResponse<JournalResponseDTO> getAllEntries(String title, Sentiment sentiment, Pageable pageable) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.debug("{} fetching entries | page: {}, size: {} | filters -> title: {}, sentiment: {}", userName, title, pageable.getPageNumber(), pageable.getPageSize(), sentiment);
        Page<JournalEntry> page;
        if(title != null && sentiment != null){
            page = journalRepository.findByUserNameAndTitleContainingIgnoreCaseAndSentiment(
                    userName, title, sentiment, pageable
            );
        } else if(title != null) {
            page = journalRepository.findByUserNameAndTitleContainingIgnoreCase(userName, title, pageable);
        } else if(sentiment != null){
            page = journalRepository.findByUserNameAndSentiment(userName, sentiment, pageable);
        } else{
            page = journalRepository.findByUserName(userName, pageable);
        }
        List<JournalResponseDTO> content = page
                .getContent()
                .stream()
                .map(journalMapper::toDTO)
                .toList();
        return new PageResponse<>(content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast());
    }

    //get entry by id
    public JournalResponseDTO getById(String id) {
         Authentication auth = SecurityContextHolder.getContext().getAuthentication();
         String userName = auth.getName();
         boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        JournalEntry entry = journalRepository.findById(id).orElseThrow(() -> {
            logger.warn("Journal with Id: {} not found.", id);
            return new ResourceNotFoundException("Journal not found.");
        });
        if(isAdmin) return journalMapper.toDTO(entry);
        if (!entry.getUserName().equals(userName)) {
            logger.warn("Unauthorized access attempt by user: {} for entry Id: {}", userName, id);
            throw new AccessDeniedException("Access Denied");
        }
        logger.info("Entry retrieved by user: {}. Id: {}", userName, id);
        return journalMapper.toDTO(entry);
    }

    //update entry
    public JournalResponseDTO updateEntry(String id, JournalUpdateDTO dto) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        JournalEntry entry = journalRepository.findById(id).orElseThrow(
                () -> {
                    logger.warn("Journal not found. Id: {}", id);
                    return new ResourceNotFoundException("Journal not found.");
                }
        );
        if (!entry.getUserName().equals(userName)) {
            logger.warn("Unauthorized access attempt by user: {} for entry Id: {}", userName, id);
            throw new AccessDeniedException("Access Denied");
        }
        if (dto.getTitle() != null) entry.setTitle(dto.getTitle());
        if (dto.getContent() != null) entry.setContent(dto.getContent());
        if (dto.getSentiment() != null) entry.setSentiment(dto.getSentiment());
        JournalEntry updated = journalRepository.save(entry);
        logger.info("Entry updated by user: {}. Id: {} ", userName, id);
        return journalMapper.toDTO(updated);
    }

    //delete entry
    public void deleteEntry(String id) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        JournalEntry entry = journalRepository.findById(id).orElseThrow(
                () -> {
                    logger.warn("Journal not found. Id: {}", id);
                    return new ResourceNotFoundException("Journal not found.");
                }
        );
        if (!entry.getUserName().equals(userName)) {
            logger.warn("Unauthorized access attempt by user: {} for entry Id: {}", userName, id);
            throw new AccessDeniedException("Access Denied");
        }
        logger.info("Entry deleted by user: {}. Id: {}", userName, id);
        journalRepository.delete(entry);
    }

    //get entries for admin
    public PageResponse<JournalAdminResponseDTO> getAllEntriesForAdmin(
            String title,
            Sentiment sentiment,
            String userName,
            Pageable pageable) {

        Query query = new Query();

        List<Criteria> criteriaList = new ArrayList<>();

        if (title != null && !title.isEmpty()) {
            criteriaList.add(Criteria.where("title").regex(title, "i"));
        }

        if (sentiment != null) {
            criteriaList.add(Criteria.where("sentiment").is(sentiment));
        }

        if (userName != null && !userName.isEmpty()) {
            criteriaList.add(Criteria.where("userName").is(userName));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        long total = mongoTemplate.count(query, JournalEntry.class);

        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));
        query.with(pageable);

        List<JournalEntry> entries = mongoTemplate.find(query, JournalEntry.class);

        List<JournalAdminResponseDTO> content = entries.stream()
                .map(journalMapper::toAdminDTO)
                .toList();

        return PageResponse.<JournalAdminResponseDTO>builder()
                .content(content)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(total)
                .totalPages((int) Math.ceil((double) total / pageable.getPageSize()))
                .last((pageable.getPageNumber() + 1) * pageable.getPageSize() >= total)
                .build();
    }
}
