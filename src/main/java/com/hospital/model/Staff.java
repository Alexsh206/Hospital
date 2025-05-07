package com.hospital.model;

import lombok.Data;

@Data
public class Staff {
    private int id;
    private String lastName;
    private String firstName;
    private String patronymic;
    private String position;
    private String phone;
    private String password;
}
