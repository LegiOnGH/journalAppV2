package com.example.legion.journalApp2.controller;

import com.example.legion.journalApp2.dto.response.JournalAdminResponseDTO;
import com.example.legion.journalApp2.dto.response.PageResponse;
import com.example.legion.journalApp2.service.JournalService;
import com.example.legion.journalApp2.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final JournalService journalService;

    public AdminController(UserService userService, JournalService journalService) {
        this.userService = userService;
        this.journalService = journalService;
    }

    //Get entries
    @GetMapping("/entries")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<JournalAdminResponseDTO>> getAllEntries(Pageable pageable){
        return ResponseEntity.ok(journalService.getAllEntriesForAdmin(pageable));
    }

    //DeleteUsers
    @DeleteMapping("/delete/{userName}")
    public ResponseEntity<String> deleteUser(@PathVariable String userName){
        userService.deleteUserByAdmin(userName);
        return ResponseEntity.ok("User deleted successfully.");
    }
}
