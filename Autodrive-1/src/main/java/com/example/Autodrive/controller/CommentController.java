package com.example.Autodrive.controller;

import com.example.Autodrive.model.Comment;
import com.example.Autodrive.model.Course;
import com.example.Autodrive.repository.CommentRepository;
import com.example.Autodrive.repository.CourseRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;


@AllArgsConstructor
@RequestMapping("api/comments")
@RestController
@CrossOrigin(origins = "*") // Permettre les requêtes CORS depuis n'importe quelle origine
public class CommentController {

    private final CommentRepository commentRepository;
    private final CourseRepository courseRepository;
    //
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Comment>> getCommentsByUser(@PathVariable String userId) {
        List<Comment> comments = commentRepository.findByUserId(userId);
        System.out.println("Commentaires de l'utilisateur " + userId + " : " + comments.size());
        return ResponseEntity.ok(comments);
    }

    //
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        if (!commentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        commentRepository.deleteById(id);
        System.out.println("Commentaire supprimé : " + id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/create")
    public ResponseEntity<Comment> createComment(@RequestBody Comment comment) {
        if (comment.getCourseId() == null) {
            return ResponseEntity.badRequest().build();
        }

        // Récupérer la course pour extraire le userId
        Course course = courseRepository.findById(comment.getCourseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course non trouvée"));

        comment.setUserId(course.getUserId());
        comment.setCreatedAt(LocalDateTime.now());

        Comment saved = commentRepository.save(comment);
        System.out.println("Commentaire enregistré pour course " + comment.getCourseId() + ", user " + comment.getUserId());
        return ResponseEntity.ok(saved);
    }

}
