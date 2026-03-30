package com.example.legion.journalApp2.controller;

import com.example.legion.journalApp2.dto.request.JournalRequestDTO;
import com.example.legion.journalApp2.dto.request.JournalUpdateDTO;
import com.example.legion.journalApp2.dto.response.JournalResponseDTO;
import com.example.legion.journalApp2.service.JournalService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        logger.info("Create entry API called.");
        return ResponseEntity.ok(journalService.createEntry(dto));
    }

    //Get entries
    @GetMapping("/getAll")
    public ResponseEntity<List<JournalResponseDTO>> getAll(){
        logger.info("Fetching all journal entries.");
        return ResponseEntity.ok(journalService.getAllEntries());
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
        logger.info("Update entry called for Id: {}", id);
        return ResponseEntity.ok(journalService.updateEntry(id, dto));
    }

    //Delete entry
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id){
        logger.info("Delete entry called for Id: {}", id);
        journalService.deleteEntry(id);
        return ResponseEntity.ok("Deleted Successfully.");
    }
}
