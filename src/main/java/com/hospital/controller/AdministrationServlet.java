package com.hospital.controller;

import com.hospital.dao.AdministrationDAO;
import com.hospital.model.Administration;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@WebServlet(urlPatterns = {"/api/administration", "/api/administration/*"})
public class AdministrationServlet extends HttpServlet{
   private final AdministrationDAO administrationDAO = new AdministrationDAO();

    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();
        if (pathInfo != null && pathInfo.length() > 1) {
            int id = Integer.parseInt(pathInfo.substring(1));
            Administration ad = null;
            try {
                ad = administrationDAO.getAdministrationById(id);
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
            if (ad != null) {
            writeJson(resp, ad);
            }
            else {
                List<Administration> administrations = null;
                try {
                    administrations = administrationDAO.getAllAdministrators();
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
                writeJson(resp, administrations);
            }
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
