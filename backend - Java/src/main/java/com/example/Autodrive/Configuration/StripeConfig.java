package com.example.Autodrive.Configuration;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @PostConstruct
    public void init() {
        // Initialize Stripe configuration here
        // For example, set API keys or other configurations
        Stripe.apiKey = "sk_test_51RrWv01ImZ7JQ2To5QIIBiq2ZF2gKrlM3zid4sjsdn4W58mcr3Nzc8O8CbUCwZkYh4XHgh4UxL66SxpYeR8XrMQX00OemILBOr";
        System.out.println("Stripe configuration initialized.");
    }
}
