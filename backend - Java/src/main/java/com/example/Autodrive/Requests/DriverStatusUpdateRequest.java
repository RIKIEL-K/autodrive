package com.example.Autodrive.Requests;


import lombok.Data;

@Data
public class DriverStatusUpdateRequest {
    private boolean enLigne;
    private Double latitude;
    private Double longitude;
}
