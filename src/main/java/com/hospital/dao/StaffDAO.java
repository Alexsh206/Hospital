package com.hospital.dao;

import com.hospital.model.Staff;
import com.hospital.util.DBConnectionUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StaffDAO {

    public List<Staff> getAllStaff() {
        List<Staff> staffList = new ArrayList<>();
        String sql = "SELECT * FROM staff";

        try (Connection conn = DBConnectionUtil.getConnection();
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

        try (Connection conn = DBConnectionUtil.getConnection();
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

    public Staff getStaffById(int id) {
        String sql = "SELECT * FROM staff WHERE id = ?";
        Staff s = null;

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                s = new Staff();
                s.setId(rs.getInt("id"));
                s.setLastName(rs.getString("last_name"));
                s.setFirstName(rs.getString("first_name"));
                s.setPatronymic(rs.getString("patronymic"));
                s.setPosition(rs.getString("position"));
                s.setPhone(rs.getString("phone"));
                s.setPassword(rs.getString("password"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return s;
    }

    public void updateStaff(Staff s) {
        String sql = "UPDATE staff SET last_name = ?, first_name = ?, patronymic = ?, position = ?, phone = ?, password = ? WHERE id = ?";

        try (Connection conn = DBConnectionUtil.getConnection();
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

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
