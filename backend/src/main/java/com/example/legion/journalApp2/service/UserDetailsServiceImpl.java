package com.example.legion.journalApp2.service;

import com.example.legion.journalApp2.entity.User;
import com.example.legion.journalApp2.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> {
                    logger.warn("User not found for username: {}", userName);
                    return new UsernameNotFoundException("User not found.");
                });
        return new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getPassword(),
                new ArrayList<>()
        );
    }
}
