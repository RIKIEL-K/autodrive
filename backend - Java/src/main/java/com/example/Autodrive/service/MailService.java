package com.example.Autodrive.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class MailService {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendResetPasswordEmail(String to, String token) {
        // Implémentation de l'envoi d'email pour la réinitialisation du mot de passe
        // Utilisation de javaMailSender pour envoyer l'email
        // Exemple : javaMailSender.send(message);



        String resetPasswordUrl = "http://localhost:8082/api/auth/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, please click the link below:\n\n" + resetPasswordUrl);

        javaMailSender.send(message);
    }


}
