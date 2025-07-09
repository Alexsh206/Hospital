package com.hospital.model;

import lombok.Data;

@Data
public class Administration {
    private int id;
    private String phone;
    private String password;
    private String first_name;
    private String last_name;
    private String position;
}
