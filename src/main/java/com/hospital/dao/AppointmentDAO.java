package com.hospital.dao;

import com.hospital.model.Appointment;
import com.hospital.util.DBConnectionUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AppointmentDAO {

    public List<Appointment> getAllAppointments() {
        List<Appointment> list = new ArrayList<>();
        String sql = "SELECT * FROM appointments";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Appointment a = new Appointment();
                a.setId(rs.getInt("id"));
                a.setDate(rs.getDate("date").toLocalDate());
                a.setDiagnosis(rs.getString("diagnosis"));
                a.setMedication(rs.getString("medication"));
                a.setProcedure(rs.getString("procedure"));
                a.setSurgery(rs.getString("surgery"));
                a.setStatus(rs.getString("status"));
                a.setDoctorId(rs.getInt("doctor_id"));
                a.setPatientId(rs.getInt("patient_id"));
                list.add(a);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }

    public void addAppointment(Appointment a) {
        String sql = "INSERT INTO appointments (date, diagnosis, medication, procedure, surgery, status, doctor_id, patient_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setDate(1, Date.valueOf(a.getDate()));
            stmt.setString(2, a.getDiagnosis());
            stmt.setString(3, a.getMedication());
            stmt.setString(4, a.getProcedure());
            stmt.setString(5, a.getSurgery());
            stmt.setString(6, a.getStatus());
            stmt.setInt(7, a.getDoctorId());
            stmt.setInt(8, a.getPatientId());
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public Appointment getAppointmentById(int id) {
        String sql = "SELECT * FROM appointments WHERE id = ?";
        Appointment a = null;

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                a = new Appointment();
                a.setId(rs.getInt("id"));
                a.setDate(rs.getDate("date").toLocalDate());
                a.setDiagnosis(rs.getString("diagnosis"));
                a.setMedication(rs.getString("medication"));
                a.setProcedure(rs.getString("procedure"));
                a.setSurgery(rs.getString("surgery"));
                a.setStatus(rs.getString("status"));
                a.setDoctorId(rs.getInt("doctor_id"));
                a.setPatientId(rs.getInt("patient_id"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return a;
    }

    public void updateAppointment(Appointment a) {
        String sql = "UPDATE appointments SET date = ?, diagnosis = ?, medication = ?, procedure = ?, surgery = ?, status = ?, doctor_id = ?, patient_id = ? WHERE id = ?";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setDate(1, Date.valueOf(a.getDate()));
            stmt.setString(2, a.getDiagnosis());
            stmt.setString(3, a.getMedication());
            stmt.setString(4, a.getProcedure());
            stmt.setString(5, a.getSurgery());
            stmt.setString(6, a.getStatus());
            stmt.setInt(7, a.getDoctorId());
            stmt.setInt(8, a.getPatientId());
            stmt.setInt(9, a.getId());
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteAppointment(int id) {
        String sql = "DELETE FROM appointments WHERE id = ?";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
