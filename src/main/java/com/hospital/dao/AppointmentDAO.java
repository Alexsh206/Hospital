package com.hospital.dao;

import com.hospital.model.Appointment;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import static com.hospital.util.DBConnectionUtil.getConnection;

public class AppointmentDAO {


    public List<Appointment> getAllAppointments() {
        List<Appointment> list = new ArrayList<>();
        String sql = """
            SELECT
              id,
              appointment_date,
              diagnosis,
              medication,
              procedure_name,
              surgery,
              status,
              doctor_id,
              patient_id
            FROM appointments
            ORDER BY appointment_date
        """;

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapRow(rs));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }


    public Appointment getAppointmentById(int id) {
        String sql = """
            SELECT
              id,
              appointment_date,
              diagnosis,
              medication,
              procedure_name,
              surgery,
              status,
              doctor_id,
              patient_id
            FROM appointments
            WHERE id = ?
        """;
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }


    public void addAppointment(Appointment a) throws SQLException {
        String sql = """
        INSERT INTO appointment
          (appointment_date, diagnosis, medication, procedure_name,
           surgery, status, doctor_id, patient_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
        """;

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            // 1) встановлюємо параметри
            ps.setDate(1, java.sql.Date.valueOf(a.getAppointmentDate()));
            ps.setString(2, a.getDiagnosis());
            ps.setString(3, a.getMedication());
            ps.setString(4, a.getProcedureName());
            ps.setString(5, a.getSurgery());
            ps.setString(6, a.getStatus());
            ps.setInt(7, a.getDoctorId());
            ps.setInt(8, a.getPatientId());

            // 2) виконуємо і читаємо повернений id
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    int newId = rs.getInt("id");
                    a.setId(newId);           // зберігаємо його в моделі, якщо треба
                } else {
                    throw new SQLException("Не вдалося отримати ID новоствореного призначення");
                }
            }
        }
    }


    public void updateAppointment(Appointment a) {
        String sql = """
            UPDATE appointments SET
              appointment_date = ?,
              diagnosis        = ?,
              medication       = ?,
              procedure_name   = ?,
              surgery          = ?,
              status           = ?,
              doctor_id        = ?,
              patient_id       = ?
            WHERE id = ?
        """;

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setDate(1, Date.valueOf(a.getAppointmentDate()));
            ps.setString(2, a.getDiagnosis());
            ps.setString(3, a.getMedication());
            ps.setString(4, a.getProcedureName());
            ps.setString(5, a.getSurgery());
            ps.setString(6, a.getStatus());
            ps.setInt   (7, a.getDoctorId());
            ps.setInt   (8, a.getPatientId());
            ps.setInt   (9, a.getId());

            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    public void deleteAppointment(int id) {
        String sql = "DELETE FROM appointments WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    private Appointment mapRow(ResultSet rs) throws SQLException {
        Appointment a = new Appointment();
        a.setId(rs.getInt("id"));
        a.setAppointmentDate(rs.getDate("appointment_date").toLocalDate());
        a.setDiagnosis(rs.getString("diagnosis"));
        a.setMedication(rs.getString("medication"));
        a.setProcedureName(rs.getString("procedure_name"));
        a.setSurgery(rs.getString("surgery"));
        a.setStatus(rs.getString("status"));
        a.setDoctorId(rs.getInt("doctor_id"));
        a.setPatientId(rs.getInt("patient_id"));
        return a;
    }
}
