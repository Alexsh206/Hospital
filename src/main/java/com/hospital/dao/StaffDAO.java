package com.hospital.dao;

import com.hospital.model.Staff;
import com.hospital.util.DBConnectionUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static com.hospital.util.DBConnectionUtil.getConnection;

public class StaffDAO {

    public List<Staff> getAllStaff() {
        List<Staff> staffList = new ArrayList<>();
        String sql = "SELECT * FROM staff";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Staff s = new Staff();
                s.setId(rs.getInt("id"));
                s.setLastName(rs.getString("last_name"));
                s.setFirstName(rs.getString("first_name"));
                s.setPatronymic(rs.getString("patronymic"));
                s.setPosition(rs.getString("position"));
                s.setPhone(rs.getString("phone"));
                s.setPassword(rs.getString("password"));
                staffList.add(s);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return staffList;
    }

    public void addStaff(Staff s) {
        String sql = "INSERT INTO staff (last_name, first_name, patronymic, position, phone, password) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, s.getLastName());
            stmt.setString(2, s.getFirstName());
            stmt.setString(3, s.getPatronymic());
            stmt.setString(4, s.getPosition());
            stmt.setString(5, s.getPhone());
            stmt.setString(6, s.getPassword());
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public Staff getStaffById(int id) throws SQLException {
        String sql = """
            SELECT id,
                   first_name,
                   last_name,
                   patronymic,
                   position,
                   phone
              FROM staff
             WHERE id = ?
            """;

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Staff s = new Staff();
                    s.setId(           rs.getInt("id"));
                    s.setFirstName(    rs.getString("first_name"));
                    s.setLastName(     rs.getString("last_name"));
                    s.setPatronymic(   rs.getString("patronymic"));
                    s.setPosition(    rs.getString("position"));
                    s.setPhone(        rs.getString("phone"));
                    return s;
                } else {
                    return null;
                }
            }
        }
    }

    public void updateStaff(Staff s) {
        String sql = "UPDATE staff SET last_name = ?, first_name = ?, patronymic = ?, position = ?, phone = ?, password = ? WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, s.getLastName());
            stmt.setString(2, s.getFirstName());
            stmt.setString(3, s.getPatronymic());
            stmt.setString(4, s.getPosition());
            stmt.setString(5, s.getPhone());
            stmt.setString(6, s.getPassword());
            stmt.setInt(7, s.getId());
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteStaff(int id) {
        String sql = "DELETE FROM staff WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Staff mapRow(ResultSet rs) throws SQLException {
        Staff s = new Staff();
        s.setId         (rs.getInt   ("id"));
        s.setLastName   (rs.getString("last_name"));
        s.setFirstName  (rs.getString("first_name"));
        s.setPatronymic (rs.getString("patronymic"));
        s.setPosition   (rs.getString("position"));
        s.setPhone      (rs.getString("phone"));
        s.setPassword   (rs.getString("password"));
        return s;
    }

    public Staff loginByPhoneAndPassword(String phone, String password) throws SQLException {
        String sql = "SELECT * FROM staff WHERE phone = ? AND password = ?";
        try (Connection c = getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, phone);
            ps.setString(2, password);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        }
        return null;
    }
}
