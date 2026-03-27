package com.example.legion.journalApp2.controller;

import com.example.legion.journalApp2.dto.request.JournalRequestDTO;
import com.example.legion.journalApp2.dto.request.JournalUpdateDTO;
import com.example.legion.journalApp2.dto.response.JournalResponseDTO;
import com.example.legion.journalApp2.entity.JournalEntry;
import com.example.legion.journalApp2.service.JournalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.List;

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

    //Get entries
    @GetMapping("/getAll")
    public ResponseEntity<List<JournalResponseDTO>> getAll(){
        return ResponseEntity.ok(journalService.getAllEntries());
    }

    //Get entry by id
    @GetMapping("/get/{id}")
    public ResponseEntity<JournalResponseDTO> getById(@PathVariable String id){
        return ResponseEntity.ok(journalService.getById(id));
    }

    //Update entry
    @PatchMapping("/update/{id}")
    public ResponseEntity<JournalResponseDTO> update(@PathVariable String id, @RequestBody JournalUpdateDTO dto){
        return ResponseEntity.ok(journalService.updateEntry(id, dto));
    }

    //Delete entry
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable String id){
        journalService.deleteEntry(id);
        return ResponseEntity.ok("Deleted Successfully.");
    }
}
