package com.example.legion.journalApp2.exception;

import com.example.legion.journalApp2.dto.response.ErrorResponse;
import com.example.legion.journalApp2.dto.response.ValidationErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.security.access.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

        private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        // 400 - Bad Request
        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex){

            logger.warn("BadRequestException: {}", ex.getMessage());

            ErrorResponse response = new ErrorResponse(
                    HttpStatus.BAD_REQUEST.value(),
                    ex.getMessage(),
                    LocalDateTime.now()
            );

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // 400 - Invalid Method Argument
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ValidationErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex){

            Map<String, String> errors = new HashMap<>();

            ex.getBindingResult().getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );

            logger.warn("Validation failed: {}", errors);

            ValidationErrorResponse response = new ValidationErrorResponse(
                    HttpStatus.BAD_REQUEST.value(),
                    "Validation failed",
                    errors,
                    LocalDateTime.now()
            );

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // 401 - Unauthorized
        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex){

            logger.warn("BadCredentials: {}", ex.getMessage());

            ErrorResponse response = new ErrorResponse(
                    HttpStatus.UNAUTHORIZED.value(),
                    ex.getMessage(),
                    LocalDateTime.now()
            );

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // 403 - Forbidden
        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex){

            logger.warn("AccessDenied: {}", ex.getMessage());

            ErrorResponse response = new ErrorResponse(
                    HttpStatus.FORBIDDEN.value(),
                    ex.getMessage(),
                    LocalDateTime.now()
            );

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        // 404 - Not Found
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex){

            logger.warn("ResourceNotFound: {}", ex.getMessage());

            ErrorResponse response = new ErrorResponse(
                    HttpStatus.NOT_FOUND.value(),
                    ex.getMessage(),
                    LocalDateTime.now()
            );

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // 500 - Internal Server Error
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGenericException(Exception ex){

            logger.error("Unhandled exception occurred", ex);

            ErrorResponse response = new ErrorResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Something went wrong",
                    LocalDateTime.now()
            );

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
}

