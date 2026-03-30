package com.example.legion.journalApp2.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")
    private long expiration;

    //Generate token
    public String generateToken(String userName){
        logger.debug("Generating JWT token for user: {}", userName);

        String token = Jwts.builder()
                .subject(userName)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+ expiration))
                .signWith(getSignKey())
                .compact();

        logger.debug("JWT token generated successfully for user: {}", userName);

        return token;
    }

    //Extract Username
    public String extractUserName(String token){
        try {
            String userName = extractAllClaims(token).getSubject();
            logger.debug("Extracted username from token: {}", userName);
            return userName;
        } catch (Exception e){
            logger.warn("Failed to extract username from token");
            throw e;
        }
    }

    //Validate token
    public boolean validateToken(String token, String userName){
        try {
            final String extractedUserName = extractUserName(token);
            boolean isValid = extractedUserName.equals(userName) && !isTokenExpired(token);

            if(isValid){
                logger.debug("Token is valid for user: {}", userName);
            } else {
                logger.warn("Token validation failed for user: {}", userName);
            }

            return isValid;

        } catch (Exception e){
            logger.warn("Exception during token validation for user: {}", userName);
            return false;
        }
    }

    //Helper Methods
    private boolean isTokenExpired(String token){
        return  extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token){
        try {
            return Jwts.parser()
                    .verifyWith((SecretKey) getSignKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e){
            logger.warn("Failed to parse JWT token");
            throw e;
        }
    }

    private Key getSignKey(){
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
