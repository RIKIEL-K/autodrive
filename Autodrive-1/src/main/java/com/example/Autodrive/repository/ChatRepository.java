package com.example.Autodrive.repository;


import com.example.Autodrive.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByCourseIdOrderByTimestampAsc(String courseId);
}
