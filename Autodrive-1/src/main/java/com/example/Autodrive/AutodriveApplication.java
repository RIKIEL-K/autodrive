package com.example.Autodrive;

import com.example.Autodrive.model.Role;
import com.example.Autodrive.model.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.example.Autodrive.repository.UserRepository;



@SpringBootApplication
public class AutodriveApplication {

	public static void main(String[] args) {
		SpringApplication.run(AutodriveApplication.class, args);
	}

}
