package com.example.Autodrive.Requests;

import com.example.Autodrive.DTO.PositionDTO;


public class CourseRequestDTO {
    private String userId;
    private PositionDTO depart;
    private PositionDTO destination;


    public CourseRequestDTO() {}

    public CourseRequestDTO(String userId, PositionDTO depart, PositionDTO destination) {
        this.userId = userId;
        this.depart = depart;
        this.destination = destination;
    }


    public String getUserId() {
        return userId;
    }

    public PositionDTO getDepart() {
        return depart;
    }

    public PositionDTO getDestination() {
        return destination;
    }

    // Setters
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setDepart(PositionDTO depart) {
        this.depart = depart;
    }

    public void setDestination(PositionDTO destination) {
        this.destination = destination;
    }
}
