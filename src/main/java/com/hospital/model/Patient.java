package com.hospital.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Patient {
    private int id;
    private String lastName;
    private String firstName;
    private String patronymic;
    private String sex;
    private LocalDate dateOfBirth;
    private String phone;
    private String password;
}
