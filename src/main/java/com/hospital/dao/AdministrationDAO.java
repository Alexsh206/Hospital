package com.hospital.dao;

import java.sql.*;

import com.hospital.model.Administration;
import static com.hospital.util.DBConnectionUtil.getConnection;

public class AdministrationDAO {
    private Administration mapRow(ResultSet rs) throws SQLException {
        Administration ad = new Administration();
        ad.setId(rs.getInt("id"));
        ad.setPhone(rs.getString("phone"));
        ad.setPassword(rs.getString("password"));
        ad.setFirst_name(rs.getString("first_name"));
        ad.setLast_name(rs.getString("last_name"));
        ad.setPosition(rs.getString("position"));
        return ad;
    }
    public Administration loginByPhoneAndPassword(String phone, String password) throws SQLException {
        String sql = "SELECT * FROM administration WHERE phone = ? AND password = ?";
        try (Connection c = getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, phone);
            ps.setString(2, password);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);  //
                }
            }
        }
        return null;
    }
}
