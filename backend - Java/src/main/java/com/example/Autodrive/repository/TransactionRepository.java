package com.example.Autodrive.repository;


import com.example.Autodrive.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findAllByUserId(String userId);
}

