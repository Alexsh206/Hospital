package com.hospital.controller;

import com.hospital.dao.AdministrationDAO;
import com.hospital.dao.PatientDAO;
import com.hospital.dao.StaffDAO;
import com.hospital.model.Administration;
import com.hospital.model.Patient;
import com.hospital.model.Staff;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.sql.SQLException;
import java.util.Date;
import java.util.Map;

@WebServlet("/api/auth/profile")
public class ProfileServlet extends HttpServlet {
    private final PatientDAO patientDao = new PatientDAO();
    private final StaffDAO   staffDao   = new StaffDAO();
    private final AdministrationDAO administrationDao = new AdministrationDAO();
    private final ObjectMapper mapper = new ObjectMapper();

    private static final String SECRET = "jZ8Qc+L3B9kZ0v4oW5TnE6RqY2X1s7uVJHcAwGyfF1E=!";
    private static final Key SIGNING_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String auth = req.getHeader("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = auth.substring(7);
        try {
            Jws<Claims> jwt = Jwts.parserBuilder()
                    .setSigningKey(SIGNING_KEY)
                    .build()
                    .parseClaimsJws(token);

            Claims claims = jwt.getBody();
            String role = claims.get("role", String.class);
            int id = Integer.parseInt(claims.getSubject());

            if ("patient".equals(role)) {
                Patient p = patientDao.getPatientById(id);
                mapper.writeValue(resp.getOutputStream(), Map.of(
                        "id",    p.getId(),
                        "name",  p.getFirstName() + " " + p.getLastName(),
                        "role",  "patient"
                ));
            } else if ("staff".equals(role)) {
                Staff s = staffDao.getStaffById(id);
                mapper.writeValue(resp.getOutputStream(), Map.of(
                        "id",       s.getId(),
                        "name",     s.getFirstName() + " " + s.getLastName(),
                        "role",     "staff",
                        "position", s.getPosition()
                ));
            }

            else if ("administration".equals(role)) {
                Administration ad = administrationDao.getAdministrationById(id);
                mapper.writeValue(resp.getOutputStream(), Map.of(
                        "id", ad.getId(),
                        "name", ad.getFirst_name() + " " + ad.getLast_name(),
                        "role",  "administration",
                        "position", ad.getPosition()
                ));
            }

        } catch (JwtException e) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
