package com.example.legion.journalApp2.controller;

import com.example.legion.journalApp2.dto.request.JournalRequestDTO;
import com.example.legion.journalApp2.dto.request.JournalUpdateDTO;
import com.example.legion.journalApp2.dto.response.JournalResponseDTO;
import com.example.legion.journalApp2.dto.response.PageResponse;
import com.example.legion.journalApp2.enums.Sentiment;
import com.example.legion.journalApp2.service.JournalService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/journal")
public class JournalController {

    private static final Logger logger = LoggerFactory.getLogger(JournalController.class);

    private final JournalService journalService;

    public JournalController(JournalService journalService){
        this.journalService = journalService;
    }

    //Create entry
    @PostMapping("/create")
    public ResponseEntity<JournalResponseDTO> create(@RequestBody @Valid JournalRequestDTO dto){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.info("Create entry requested by user: {}", userName);
        return ResponseEntity.ok(journalService.createEntry(dto));
    }

    //Get entries
    @GetMapping("/getAll")
    public ResponseEntity<PageResponse<JournalResponseDTO>> getAll(@RequestParam(required = false) String title, @RequestParam(required = false) Sentiment sentiment, Pageable pageable){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        logger.debug("Fetching journal entries for user: {}",userName);
        return ResponseEntity.ok(journalService.getAllEntries(title, sentiment, pageable));
    }

    //Get entry by id
    @GetMapping("/get/{id}")
    public ResponseEntity<JournalResponseDTO> getById(@PathVariable String id){
        logger.info("Get entry by Id called for Id: {}", id);
        return ResponseEntity.ok(journalService.getById(id));
    }

    //Update entry
    @PatchMapping("/update/{id}")
    public ResponseEntity<JournalResponseDTO> update(@PathVariable String id, @RequestBody JournalUpdateDTO dto){
        logger.info("Update request received for entry Id: {}", id);
        return ResponseEntity.ok(journalService.updateEntry(id, dto));
    }

    //Delete entry
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id){
        logger.info("Delete request received for entry Id: {}", id);
        journalService.deleteEntry(id);
        return ResponseEntity.ok("Deleted Successfully.");
    }
}
