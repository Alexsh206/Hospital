package com.hospital.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnectionUtil {

    private static final String URL = "jdbc:postgresql://localhost:5432/hospital";
    private static final String USER = "postgres";
    private static final String PASSWORD = "HOSPITAL3COURSE";

    public static Connection getConnection() {
        try {
            Class.forName("org.postgresql.Driver");
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Не вдалося підключитися до бази даних");
        }
    }
}
