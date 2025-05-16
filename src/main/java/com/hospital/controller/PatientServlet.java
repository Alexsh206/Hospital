package com.hospital.controller;

import com.hospital.dao.PatientDAO;
import com.hospital.model.Patient;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet(urlPatterns = {"/api/patients", "/api/patients/*"})
public class PatientServlet extends HttpServlet {

    private final PatientDAO patientDAO = new PatientDAO();


    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo(); // те, що після /patients
        if (pathInfo != null && pathInfo.length() > 1) {
            // /patients/{id}
            int id = Integer.parseInt(pathInfo.substring(1));
            Patient p = patientDAO.getPatientById(id);
            if (p != null) {
                writeJson(resp, p);
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
            }
        } else {
            // /patients
            List<Patient> patients = patientDAO.getAllPatients();
            writeJson(resp, patients);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Patient patient = parseJson(req, Patient.class);
        try {
            patientDAO.addPatient(patient);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        resp.setStatus(HttpServletResponse.SC_CREATED);
        writeJson(resp, patient);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Patient patient = parseJson(req, Patient.class);
        patientDAO.updatePatient(patient);
        writeJson(resp, patient);
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String idParam = req.getParameter("id");
        if (idParam != null) {
            int id = Integer.parseInt(idParam);
            patientDAO.deletePatient(id);
            resp.setStatus(HttpServletResponse.SC_NO_CONTENT);
        } else {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeJson(resp, "Missing parameter 'id'");
        }
    }

    private void writeJson(HttpServletResponse resp, Object data) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        mapper.writeValue(resp.getWriter(), data);
    }


    private <T> T parseJson(HttpServletRequest req, Class<T> clazz) throws IOException {
        return mapper.readValue(req.getInputStream(), clazz);
    }
}

