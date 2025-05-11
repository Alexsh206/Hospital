package com.hospital.controller;

import com.hospital.dao.PatientDAO;
import com.hospital.dao.StaffDAO;
import com.hospital.model.Patient;
import com.hospital.model.Staff;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@WebServlet("/auth/login")
public class AuthServlet extends HttpServlet {
    private final PatientDAO patientDao = new PatientDAO();
    private final StaffDAO   staffDao   = new StaffDAO();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        // ожидаем { "phone": "...", "password": "..." }
        Map creds = mapper.readValue(req.getInputStream(), Map.class);
        String phone = (String) creds.get("phone"), pw = (String) creds.get("password");

        Patient p = null;
        try {
            p = patientDao.loginByPhoneAndPassword(phone, pw);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        if (p != null) {
            Map<String,Object> out = new HashMap<>();
            out.put("role", "patient");
            out.put("id", p.getId());
            out.put("name", p.getFirstName() + " " + p.getLastName());
            resp.setStatus(HttpServletResponse.SC_OK);
            mapper.writeValue(resp.getOutputStream(), out);
            return;
        }

        Staff s = null;
        try {
            s = staffDao.loginByPhoneAndPassword(phone, pw);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        if (s != null) {
            Map<String,Object> out = new HashMap<>();
            out.put("role", "staff");
            out.put("id", s.getId());
            out.put("name", s.getFirstName() + " " + s.getLastName());
            resp.setStatus(HttpServletResponse.SC_OK);
            mapper.writeValue(resp.getOutputStream(), out);
            return;
        }

        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        mapper.writeValue(resp.getOutputStream(),
                Map.of("error", "Invalid credentials"));
    }
}
