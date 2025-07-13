package com.hospital.dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import com.hospital.model.Administration;
import static com.hospital.util.DBConnectionUtil.getConnection;

public class AdministrationDAO {
    public List<Administration> getAllAdministrators() throws SQLException {
        List <Administration> administrators = new ArrayList<>();
        String sql = "SELECT * FROM administration";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
        while (rs.next()) {
        Administration ad = new Administration();
        ad.setId(rs.getInt("id"));
        ad.setPhone(rs.getString("phone"));
        ad.setPassword(rs.getString("password"));
        ad.setFirstname(rs.getString("first_name"));
        ad.setLastname(rs.getString("last_name"));
        ad.setPosition(rs.getString("position")); }
        }
        return administrators;
    }

    public Administration getAdministrationById(int id) throws SQLException {
        String sql = "SELECT * FROM administration WHERE id = ?";
        Administration ad = null;

        try (Connection conn = getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                ad = new Administration();
                ad.setId(rs.getInt("id"));
                ad.setPhone(rs.getString("phone"));
                ad.setPassword(rs.getString("password"));
                ad.setFirstname(rs.getString("first_name"));
                ad.setLastname(rs.getString("last_name"));
                ad.setPosition(rs.getString("position"));
            }

        }
        return ad;
    }

    private Administration mapRow(ResultSet rs) throws SQLException {
        Administration ad = new Administration();
        ad.setId(rs.getInt("id"));
        ad.setPhone(rs.getString("phone"));
        ad.setPassword(rs.getString("password"));
        ad.setFirstname(rs.getString("first_name"));
        ad.setLastname(rs.getString("last_name"));
        ad.setPosition(rs.getString("position"));
        return ad;
    }

    public Administration loginByPhoneAndPassword(String phone, String password) throws SQLException {
        String sql = "SELECT * FROM administration WHERE phone = ? AND password = ?";
        try (Connection conn = getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, phone);
            stmt.setString(2, password);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        }
        return null;
    }
}
