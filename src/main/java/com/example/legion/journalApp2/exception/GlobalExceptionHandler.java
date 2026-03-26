package com.example.legion.journalApp2.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    //Bad Request : 400
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String,String>> handleBadRequest(BadRequestException ex){
        Map<String, String> response = new HashMap<>();
        response.put("message",ex.getMessage());
        response.put("status", String.valueOf(HttpStatus.BAD_REQUEST.value()));
        response.put("timestamp", String.valueOf(LocalDateTime.now()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    //Bad Credentials : 401
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String,String>> handleBadCredentials(BadCredentialsException ex){
        Map<String,String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        response.put("status", String.valueOf(HttpStatus.UNAUTHORIZED.value()));
        response.put("timestamp", String.valueOf(LocalDateTime.now()));
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    //Not Found : 404
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String , String>> handleNotFound(ResourceNotFoundException ex){
        Map<String, String > response = new HashMap<>();
        response.put("message",ex.getMessage());
        response.put("status", String.valueOf(HttpStatus.NOT_FOUND.value()));
        response.put("timestamp", String.valueOf(LocalDateTime.now()));
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    //Fallback : 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String >> handleGeneric(Exception ex){
        Map<String, String > response = new HashMap<>();
        response.put("message","something went wrong");
        response.put("status", String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()));
        response.put("timestamp", String.valueOf(LocalDateTime.now()));
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
