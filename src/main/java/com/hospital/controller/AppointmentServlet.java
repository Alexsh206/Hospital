package com.hospital.controller;

import com.hospital.dao.AppointmentDAO;
import com.hospital.model.Appointment;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet({"/api/appointments/", "/api/appointments/*"})
public class AppointmentServlet extends HttpServlet {

    private final AppointmentDAO dao = new AppointmentDAO();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void init() throws ServletException {
        // Подключаем поддержку java.time (LocalDate) и выводим их как ISO‐строки
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");

        String path = req.getPathInfo(); // может быть null, "/", или "/{id}"
        if (path == null || "/".equals(path)) {
            // GET /api/appointments
            List<Appointment> list = dao.getAllAppointments();
            mapper.writeValue(resp.getOutputStream(), list);
        } else {
            // GET /api/appointments/{id}
            try {
                int id = Integer.parseInt(path.substring(1));
                Appointment a = dao.getAppointmentById(id);
                if (a == null) {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    mapper.writeValue(resp.getOutputStream(), Map.of("error", "Призначення не знайдено"));
                } else {
                    mapper.writeValue(resp.getOutputStream(), a);
                }
            } catch (NumberFormatException ex) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                mapper.writeValue(resp.getOutputStream(), Map.of("error", "Невірний формат ID"));
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // POST /api/appointments
        resp.setContentType("application/json;charset=UTF-8");
        try {
            Appointment a = mapper.readValue(req.getInputStream(), Appointment.class);
            dao.addAppointment(a);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            mapper.writeValue(resp.getOutputStream(), Map.of("message", "Призначення створено"));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            mapper.writeValue(resp.getOutputStream(), Map.of("error", "Не вдалося створити призначення", "details", e.getMessage()));
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // PUT /api/appointments/{id}
        resp.setContentType("application/json;charset=UTF-8");
        String path = req.getPathInfo();
        if (path == null || !path.matches("/\\d+")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            mapper.writeValue(resp.getOutputStream(), Map.of("error", "Потрібно вказати ID в URL"));
            return;
        }
        try {
            int id = Integer.parseInt(path.substring(1));
            Appointment a = mapper.readValue(req.getInputStream(), Appointment.class);
            a.setId(id);
            dao.updateAppointment(a);
            mapper.writeValue(resp.getOutputStream(), Map.of("message", "Призначення оновлено"));
        } catch (NumberFormatException ex) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            mapper.writeValue(resp.getOutputStream(), Map.of("error", "Невірний формат ID"));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            mapper.writeValue(resp.getOutputStream(), Map.of("error", "Не вдалося оновити", "details", e.getMessage()));
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // DELETE /api/appointments/{id}
        resp.setContentType("application/json;charset=UTF-8");
        String path = req.getPathInfo();
        if (path == null || !path.matches("/\\d+")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            mapper.writeValue(resp.getOutputStream(), Map.of("error", "Потрібно вказати ID в URL"));
            return;
        }
        try {
            int id = Integer.parseInt(path.substring(1));
            dao.deleteAppointment(id);
            mapper.writeValue(resp.getOutputStream(), Map.of("message", "Призначення видалено"));
        } catch (NumberFormatException ex) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            mapper.writeValue(resp.getOutputStream(), Map.of("error", "Невірний формат ID"));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            mapper.writeValue(resp.getOutputStream(), Map.of("error", "Не вдалося видалити", "details", e.getMessage()));
        }
    }
}
