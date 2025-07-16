package com.hospital.controller;

import com.google.gson.Gson;
import com.hospital.dao.StaffDAO;
import com.hospital.model.Staff;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;

@WebServlet({"/api/staff/", "/api/staff/*"})
public class StaffServlet extends HttpServlet {

    private final StaffDAO staffDAO = new StaffDAO();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setContentType("application/json;charset=UTF-8");
        String pathInfo = req.getPathInfo(); // null, "/" или "/123"

        try {
            if (pathInfo == null || "/".equals(pathInfo)) {
                List<Staff> staffList = staffDAO.getAllStaff();
                writeJson(resp, staffList);
            } else {
                String idStr = pathInfo.substring(1);
                int id = Integer.parseInt(idStr);
                Staff staff = staffDAO.getStaffById(id);
                if (staff == null) {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    writeJson(resp,
                            java.util.Map.of("error","Співробітника не знайдено"));
                } else {
                    writeJson(resp, staff);
                }
            }
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeJson(resp,
                    java.util.Map.of("error","Невірний формат ID"));
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            writeJson(resp,
                    java.util.Map.of("error","Помилка БД","details", e.getMessage()));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Staff staff = parseJson(req, Staff.class);
        staffDAO.addStaff(staff);
        writeJson(resp, java.util.Map.of("message","Співробітника додано!"));
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        Staff staff = parseJson(req, Staff.class);
        staffDAO.updateStaff(staff);
        writeJson(resp, java.util.Map.of("message","Дані співробітника оновлено!"));
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String idParam = req.getParameter("id");
        if (idParam != null) {
            int id = Integer.parseInt(idParam);
            staffDAO.deleteStaff(id);
            writeJson(resp, java.util.Map.of("message","Співробітника видалено!"));
        } else {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            writeJson(resp, java.util.Map.of("error","Потрібно вказати ID"));
        }
    }

    private void writeJson(HttpServletResponse resp, Object data) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        try (PrintWriter out = resp.getWriter()) {
            out.print(gson.toJson(data));
        }
    }

    private <T> T parseJson(HttpServletRequest req, Class<T> clazz) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return gson.fromJson(sb.toString(), clazz);
    }
}
