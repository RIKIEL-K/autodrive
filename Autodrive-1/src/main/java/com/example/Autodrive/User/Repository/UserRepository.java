package com.example.Autodrive.User.Repository;

import com.example.Autodrive.Driver.Model.Driver;
import com.example.Autodrive.User.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;


// Un repository pour gérer les opérations CRUD sur la collection User dans MongoDB
public interface UserRepository extends MongoRepository<User, String> {
    boolean existsByEmail(String email);
    boolean existsById(String id);

    Optional<User> findByEmail(String email);
}
