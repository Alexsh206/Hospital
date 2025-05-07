package com.hospital;

import com.hospital.util.DBConnectionUtil;

import java.sql.Connection;

public class TestConnection {
    public static void main(String[] args) {
        Connection conn = DBConnectionUtil.getConnection();
        if (conn != null) {
            System.out.println("✅ Підключення успішне!");
        } else {
            System.out.println("❌ Підключення не вдалося.");
        }
    }
}
