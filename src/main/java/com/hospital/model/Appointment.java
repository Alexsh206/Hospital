package com.hospital.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Appointment {
    private int id;
    private LocalDate date;
    private String diagnosis;
    private String medication;
    private String procedure;
    private String surgery;
    private String status;
    private int doctorId;
    private int patientId;
}
