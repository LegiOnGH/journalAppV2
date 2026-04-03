package com.example.legion.journalApp2.repository;

import com.example.legion.journalApp2.entity.JournalEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JournalRepository extends MongoRepository<JournalEntry, String> {
    Page<JournalEntry> findByUserName(String userName, Pageable pageable);
    void deleteByUserName(String userName);
}
