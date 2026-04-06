package com.example.legion.journalApp2.controller;

import com.example.legion.journalApp2.dto.response.JournalAdminResponseDTO;
import com.example.legion.journalApp2.dto.response.PageResponse;
import com.example.legion.journalApp2.enums.Sentiment;
import com.example.legion.journalApp2.service.JournalService;
import com.example.legion.journalApp2.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final UserService userService;
    private final JournalService journalService;

    public AdminController(UserService userService, JournalService journalService) {
        this.userService = userService;
        this.journalService = journalService;
    }

    //Get entries
    @GetMapping("/entries")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<JournalAdminResponseDTO>> getAllEntries(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Sentiment sentiment,
            @RequestParam(required = false) String userName,
            Pageable pageable){
        logger.info("Fetching entries for admin.");
        return ResponseEntity.ok(journalService.getAllEntriesForAdmin(title, sentiment, userName, pageable));
    }

    //DeleteUsers
    @DeleteMapping("/delete/{userName}")
    public ResponseEntity<String> deleteUser(@PathVariable String userName){
        userService.deleteUserByAdmin(userName);
        logger.info("Deleted user: {}",userName);
        return ResponseEntity.ok("User deleted successfully.");
    }
}
