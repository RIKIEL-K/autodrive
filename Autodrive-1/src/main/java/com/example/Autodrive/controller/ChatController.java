package com.example.Autodrive.controller;

import com.example.Autodrive.model.ChatMessage;
import com.example.Autodrive.repository.ChatRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("api")
public class ChatController {

    private final ChatRepository chatRepo;


    @MessageMapping("/chat/{courseId}")
    @SendTo("/topic/messages/{courseId}")
    public ChatMessage send(@DestinationVariable String courseId, ChatMessage message) {
        message.setCourseId(courseId);
        message.setTimestamp(System.currentTimeMillis());
        ChatMessage saved = chatRepo.save(message);
        System.out.println("Nouveau message enregistré: " + saved.getContent());
        return saved;
    }

    @GetMapping("/chat/{courseId}")
    public List<ChatMessage> getMessages(@PathVariable String courseId) {
        return chatRepo.findByCourseIdOrderByTimestampAsc(courseId);
    }
    @PostMapping("/chat/manual/{courseId}")
    public ResponseEntity<ChatMessage> sendManualMessage(@PathVariable String courseId, @RequestBody ChatMessage msg) {
        msg.setCourseId(courseId);
        msg.setTimestamp(System.currentTimeMillis());
        return ResponseEntity.ok(chatRepo.save(msg));
    }

}
