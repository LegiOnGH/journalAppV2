package com.example.legion.journalApp2.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expiration}")

    //Generate token
    public String generateToken(String userName){
        return Jwts.builder()
                .subject(userName)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+ 1000 * 60 * 60))
                .signWith(getSignKey())
                .compact();
    }

    //Extract Username
    public String extractUserName(String token){
        return extractAllClaims(token).getSubject();
    }

    //Validate token
    public boolean validateToken(String token, String userName){
        final String extractedUserName = extractUserName(token);
        return  extractedUserName.equals(userName) && !isTokenExpired(token);
    }

    //Helper Methods
    private boolean isTokenExpired(String token){
        return  extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token){
        return Jwts.parser().verifyWith((SecretKey) getSignKey())
                .build().parseSignedClaims(token)
                .getPayload();
    }

    private Key getSignKey(){
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
