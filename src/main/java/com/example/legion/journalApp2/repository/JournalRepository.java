package com.example.legion.journalApp2.repository;

import com.example.legion.journalApp2.entity.JournalEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JournalRepository extends MongoRepository<JournalEntry, String> {
    List<JournalEntry> findByUserName(String userName);
}
