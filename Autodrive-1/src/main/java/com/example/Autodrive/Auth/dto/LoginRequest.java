package com.example.Autodrive.Auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    @NotBlank
    private String role; // "DRIVER" ou "USER"

}

