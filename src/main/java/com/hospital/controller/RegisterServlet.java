package com.hospital.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.dao.PatientDAO;
import com.hospital.model.Patient;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

@WebServlet("/api/auth/register")
public class RegisterServlet extends HttpServlet {
    private final PatientDAO patientDao = new PatientDAO();
    private final ObjectMapper mapper   = new ObjectMapper();
    private static final String SECRET = "jZ8Qc+L3B9kZ0v4oW5TnE6RqY2X1s7uVJHcAwGyfF1E=";
    private static final Key SIGNING_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Map<String,String> data = mapper.readValue(req.getInputStream(), Map.class);

        Patient p = new Patient();
        p.setFirstName(data.get("firstName"));
        p.setLastName(data.get("lastName"));
        p.setPatronymic(data.get("patronymic"));
        p.setSex(data.get("sex"));
        p.setDateOfBirth(java.time.LocalDate.parse(data.get("dateOfBirth")));
        p.setPhone(data.get("phone"));
        p.setPassword(data.get("password"));


        try {
            patientDao.addPatient(p);
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            mapper.writeValue(resp.getOutputStream(),
                    Map.of("error", "Не вдалося зареєструвати пацієнта"));
            return;
        }

        Instant now = Instant.now();
        String token = Jwts.builder()
                .setSubject(String.valueOf(p.getId()))
                .claim("role", "patient")
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(1, ChronoUnit.HOURS)))
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS256)
                .compact();

        resp.setStatus(HttpServletResponse.SC_OK);
        mapper.writeValue(resp.getOutputStream(), Map.of(
                "token", token,
                "role",  "patient",
                "id",    p.getId(),
                "name",  p.getFirstName() + " " + p.getLastName()
        ));
    }
}
