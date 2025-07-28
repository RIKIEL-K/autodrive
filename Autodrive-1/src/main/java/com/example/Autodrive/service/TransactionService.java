
package com.example.Autodrive.service;

import com.example.Autodrive.model.Transaction;
import com.example.Autodrive.repository.TransactionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public List<Transaction> getTransactionsByUser(String userId) {
        return transactionRepository.findAllByUserId(userId);
    }
}

