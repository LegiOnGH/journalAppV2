package com.example.legion.journalApp2.repository;

import com.example.legion.journalApp2.entity.JournalEntry;
import com.example.legion.journalApp2.enums.Sentiment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JournalRepository extends MongoRepository<JournalEntry, String> {
    Page<JournalEntry> findByUserName(String userName, Pageable pageable);
    void deleteByUserName(String userName);
    Page<JournalEntry> findByUserNameAndTitleContainingIgnoreCaseAndSentiment(
            String userName,
            String title,
            Sentiment sentiment,
            Pageable pageable
    );
    Page<JournalEntry> findByUserNameAndTitleContainingIgnoreCase(
            String userName,
            String title,
            Pageable pageable
    );
    Page<JournalEntry> findByUserNameAndSentiment(
            String userName,
            Sentiment sentiment,
            Pageable pageable
    );
    Page<JournalEntry> findAll(Pageable pageable);
}
