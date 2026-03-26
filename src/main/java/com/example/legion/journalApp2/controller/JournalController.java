package com.example.legion.journalApp2.controller;

import com.example.legion.journalApp2.dto.request.JournalRequestDTO;
import com.example.legion.journalApp2.dto.response.JournalResponseDTO;
import com.example.legion.journalApp2.service.JournalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/journal")
public class JournalController {

    private final JournalService journalService;

    public JournalController(JournalService journalService){
        this.journalService = journalService;
    }

    //Create entry
    @PostMapping("/create")
    public ResponseEntity<JournalResponseDTO> create(@RequestBody @Valid JournalRequestDTO dto){
        return ResponseEntity.ok(journalService.createEntry(dto));
    }


}
