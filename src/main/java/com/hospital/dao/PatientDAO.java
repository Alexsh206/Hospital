package com.hospital.dao;

import com.hospital.model.Patient;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static com.hospital.util.DBConnectionUtil.getConnection;

public class PatientDAO {

    public List<Patient> getAllPatients() {
        List<Patient> patients = new ArrayList<>();
        String sql = "SELECT * FROM patients";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Patient p = new Patient();
                p.setId(rs.getInt("id"));
                p.setLastName(rs.getString("last_name"));
                p.setFirstName(rs.getString("first_name"));
                p.setPatronymic(rs.getString("patronymic"));
                p.setSex(rs.getString("sex"));
                p.setDateOfBirth(rs.getDate("date_of_birth").toLocalDate());
                p.setPhone(rs.getString("phone"));
                p.setPassword(rs.getString("password"));
                patients.add(p);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return patients;
    }

    public void addPatient(Patient p) throws SQLException {
        String sql = """
        INSERT INTO patients
          (last_name, first_name, patronymic, sex, date_of_birth, phone, password)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        RETURNING id
        """;
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, p.getLastName());
            ps.setString(2, p.getFirstName());
            ps.setString(3, p.getPatronymic());
            ps.setString(4, p.getSex());
            ps.setDate  (5, java.sql.Date.valueOf(p.getDateOfBirth()));
            ps.setString(6, p.getPhone());
            ps.setString(7, p.getPassword());

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    rs.getInt("id");
                    return;
                }
            }
        }
        throw new SQLException("Не вдалося створити пацієнта");
    }

    public Patient getPatientById(int id) {
        String sql = "SELECT * FROM patients WHERE id = ?";
        Patient p = null;

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                p = new Patient();
                p.setId(rs.getInt("id"));
                p.setLastName(rs.getString("last_name"));
                p.setFirstName(rs.getString("first_name"));
                p.setPatronymic(rs.getString("patronymic"));
                p.setSex(rs.getString("sex"));
                p.setDateOfBirth(rs.getDate("date_of_birth").toLocalDate());
                p.setPhone(rs.getString("phone"));
                p.setPassword(rs.getString("password"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return p;
    }

    public void updatePatient(Patient p) {
        String sql = "UPDATE patients SET last_name = ?, first_name = ?, patronymic = ?, sex = ?, date_of_birth = ?, phone = ?, password = ? WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, p.getLastName());
            stmt.setString(2, p.getFirstName());
            stmt.setString(3, p.getPatronymic());
            stmt.setString(4, p.getSex());
            stmt.setDate(5, Date.valueOf(p.getDateOfBirth()));
            stmt.setString(6, p.getPhone());
            stmt.setString(7, p.getPassword());
            stmt.setInt(8, p.getId());
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deletePatient(int id) {
        String sql = "DELETE FROM patients WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Patient mapRow(ResultSet rs) throws SQLException {
        Patient p = new Patient();
        p.setId           (rs.getInt   ("id"));
        p.setLastName     (rs.getString("last_name"));
        p.setFirstName    (rs.getString("first_name"));
        p.setPatronymic   (rs.getString("patronymic"));
        p.setSex          (rs.getString("sex"));
        Date dob          = rs.getDate  ("date_of_birth");
        if (dob != null)  p.setDateOfBirth(dob.toLocalDate());
        p.setPhone        (rs.getString("phone"));
        p.setPassword     (rs.getString("password"));
        return p;
    }

    public Patient loginByPhoneAndPassword(String phone, String password) throws SQLException {
        String sql = "SELECT * FROM patients WHERE phone = ? AND password = ?";
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
