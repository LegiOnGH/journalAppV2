package com.example.legion.journalApp2.service;

import com.example.legion.journalApp2.dto.request.LoginRequestDTO;
import com.example.legion.journalApp2.dto.request.SignupRequestDTO;
import com.example.legion.journalApp2.entity.User;
import com.example.legion.journalApp2.exception.BadRequestException;
import com.example.legion.journalApp2.mapper.UserMapper;
import com.example.legion.journalApp2.repository.UserRepository;
import com.example.legion.journalApp2.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldThrowExceptionWhenUsernameAlreadyExists() {

        SignupRequestDTO dto = new SignupRequestDTO();
        dto.setUserName("testUser");

        // fake repo response
        when(userRepository.findByUserName("testUser"))
                .thenReturn(Optional.of(new User()));

        // test + assert
        assertThrows(BadRequestException.class, () -> {
            authService.signup(dto);
        });
    }

    @Test
    void shouldThrowExceptionForInvalidPassword() {

        User user = new User();
        user.setUserName("testUser");
        user.setPassword("encodedPass");

        LoginRequestDTO dto = new LoginRequestDTO();
        dto.setUserName("testUser");
        dto.setPassword("wrongPass");

        when(userRepository.findByUserName("testUser"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("wrongPass", "encodedPass"))
                .thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> {
            authService.login(dto);
        });
    }
}
