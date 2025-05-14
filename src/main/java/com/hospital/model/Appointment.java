package com.hospital.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

public class Appointment {
    private Integer id;
    @Setter
    @Getter
    private LocalDate appointmentDate;
    @Setter
    @Getter
    private String diagnosis;
    @Setter
    @Getter
    private String medication;
    @Setter
    @Getter
    private String procedureName;
    @Getter
    @Setter
    private String surgery;
    @Getter
    @Setter
    private String status;
    private Integer doctorId;
    private Integer patientId;


    public Appointment() {}


    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getDoctorId() { return doctorId; }
    public void setDoctorId(int doctorId) { this.doctorId = doctorId; }

    public int getPatientId() { return patientId; }
    public void setPatientId(int patientId) { this.patientId = patientId; }
}
