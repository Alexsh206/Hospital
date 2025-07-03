package com.hospital.controller;

import com.hospital.dao.PatientDAO;
import com.hospital.dao.StaffDAO;
import com.hospital.model.Patient;
import com.hospital.model.Staff;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.sql.SQLException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/api/auth/login")
public class AuthServlet extends HttpServlet {
    private final PatientDAO patientDao = new PatientDAO();
    private final StaffDAO   staffDao   = new StaffDAO();
    private final ObjectMapper mapper   = new ObjectMapper();

    private static final String SECRET = "jZ8Qc+L3B9kZ0v4oW5TnE6RqY2X1s7uVJHcAwGyfF1E=";
    private static final Key    SIGNING_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    private String createJwtForUser(int userId, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("role", role)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(1, ChronoUnit.HOURS)))
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        Map<?,?> creds = mapper.readValue(req.getInputStream(), Map.class);
        String phone = (String) creds.get("phone");
        String pw    = (String) creds.get("password");

        try {
            Patient p = patientDao.loginByPhoneAndPassword(phone, pw);
            if (p != null) {
                String token = createJwtForUser(p.getId(), "patient");
                Map<String,Object> out = new HashMap<>();
                out.put("token", token);
                out.put("role",  "patient");
                out.put("id",    p.getId());
                out.put("name",  p.getFirstName() + " " + p.getLastName());
                resp.setStatus(HttpServletResponse.SC_OK);
                mapper.writeValue(resp.getOutputStream(), out);
                return;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        try {
            Staff s = staffDao.loginByPhoneAndPassword(phone, pw);
            if (s != null) {
                String token = createJwtForUser(s.getId(), "staff");
                Map<String,Object> out = new HashMap<>();
                out.put("token",    token);
                out.put("role",     "staff");
                out.put("position", s.getPosition());
                out.put("id",       s.getId());
                out.put("name",     s.getFirstName() + " " + s.getLastName());
                resp.setStatus(HttpServletResponse.SC_OK);
                mapper.writeValue(resp.getOutputStream(), out);
                return;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        mapper.writeValue(resp.getOutputStream(),
                Map.of("error", "Invalid credentials"));
    }
}
