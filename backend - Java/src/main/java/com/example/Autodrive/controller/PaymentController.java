package com.example.Autodrive.controller;

import com.example.Autodrive.Driver.Model.Driver;
import com.example.Autodrive.User.Model.User;
import com.example.Autodrive.Driver.Repository.DriverRepository;
import com.example.Autodrive.User.Repository.UserRepository;
import com.example.Autodrive.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/payment")
public class PaymentController {


    private final StripeService stripeService;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;

    @PostMapping("/user/add-card")
    public ResponseEntity<?> addCard(@RequestBody Map<String, String> request) throws StripeException {
        String userId = request.get("userId");
        String tokenId = request.get("tokenId");

        User user = userRepository.findById(userId).orElseThrow();
        stripeService.registerUserStripeCustomer(user, tokenId);
        return ResponseEntity.ok("Carte enregistrée");
    }

    @PostMapping("/driver/add-card")
    public ResponseEntity<?> addCardForDriver(@RequestBody Map<String, String> request) throws StripeException {
        String driverId = request.get("driverId");
        String tokenId = request.get("tokenId");

        if (driverId == null || tokenId == null) {
            return ResponseEntity.badRequest().body("Données manquantes");
        }

        Driver driver = driverRepository.findById(driverId).orElseThrow();
        stripeService.registerDriverStripeCustomer(driver, tokenId);

        return ResponseEntity.ok("Carte enregistrée pour le chauffeur !");
    }


    @GetMapping("/user/{userId}/solde")
    public ResponseEntity<?> getUserSolde(@PathVariable String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return ResponseEntity.ok(Map.of("solde", user.getSolde()));
    }

    @PostMapping("/user/add-balance")
    public ResponseEntity<?> addBalance(@RequestBody Map<String, Object> request) throws StripeException {
        String userId = request.get("userId").toString();
        String tokenId = request.get("tokenId").toString();
        Double amount = Double.valueOf(request.get("amount").toString());

        if (userId == null || tokenId == null || amount == null || amount <= 0) {
            return ResponseEntity.badRequest().body("Informations incomplètes ou invalides.");
        }

        User user = userRepository.findById(userId).orElseThrow();

        // Création du client Stripe si inexistant
        if (user.getStripeCustomerId() == null) {
            stripeService.registerUserStripeCustomer(user, tokenId);
        }

        // Paiement immédiat vers la plateforme (aucun transfert)
        long amountInCents = (long) (amount * 100);

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .setCustomer(user.getStripeCustomerId())
                .setConfirm(true)
                .setDescription("Ajout au solde Autodrive")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .setAllowRedirects(PaymentIntentCreateParams.AutomaticPaymentMethods.AllowRedirects.NEVER)
                                .build()
                )
                .build();


        PaymentIntent intent = PaymentIntent.create(params);

        // Mise à jour du solde utilisateur
        user.setSolde(user.getSolde() + amount);
        userRepository.save(user);

        System.out.println("Solde mis à jour pour l'utilisateur " + userId + ": " + user.getSolde());

        return ResponseEntity.ok("Solde ajouté avec succès !");
    }

    @GetMapping("/driver/{driverId}/solde")
    public ResponseEntity<?> getDriverSolde(@PathVariable String driverId) {
        Driver driver = driverRepository.findById(driverId).orElseThrow();
        return ResponseEntity.ok(Map.of("solde", driver.getSolde()));
    }


}
