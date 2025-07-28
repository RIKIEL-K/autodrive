package com.example.Autodrive.controller;

import com.example.Autodrive.model.Transaction;
import com.example.Autodrive.service.TransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@AllArgsConstructor
@CrossOrigin
public class TransactionController {

    private final TransactionService transactionService;


    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTransactions(@PathVariable String userId) {
        List<Transaction> transactions = transactionService.getTransactionsByUser(userId);
        if (transactions.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(transactions);
    }
}

