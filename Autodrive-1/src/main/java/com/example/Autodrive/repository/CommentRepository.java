package com.example.Autodrive.repository;

import com.example.Autodrive.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findByUserId(String userId);

    void deleteById(String id);
}
