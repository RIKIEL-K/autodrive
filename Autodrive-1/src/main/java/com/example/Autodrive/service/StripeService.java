package com.example.Autodrive.service;

import com.example.Autodrive.model.Driver;
import com.example.Autodrive.model.User;
import com.example.Autodrive.repository.DriverRepository;
import com.example.Autodrive.repository.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class StripeService {


    private final UserRepository userRepository;
    private final DriverRepository driverRepository;

    public void registerUserStripeCustomer(User user, String tokenId) throws StripeException {
        CustomerCreateParams params = CustomerCreateParams.builder()
                .setSource(tokenId)
                .setEmail(user.getEmail())
                .build();
        Customer customer = Customer.create(params);
        user.setStripeCustomerId(customer.getId());
        userRepository.save(user);
    }

    public void registerDriverStripeCustomer(Driver driver, String tokenId) throws StripeException {
        if (driver.getStripeAccountId() != null) {
            return; // déjà enregistré
        }

        CustomerCreateParams customerParams = CustomerCreateParams.builder()
                .setEmail(driver.getEmail())
                .setName(driver.getFirstname() + " " + driver.getLastname())
                .setSource(tokenId) // ajouter une carte via token
                .build();

        Customer customer = Customer.create(customerParams);
        driver.setStripeAccountId(customer.getId());
        driverRepository.save(driver);
    }


    public void registerDriverStripeAccount(Driver driver) throws StripeException {
        AccountCreateParams params = AccountCreateParams.builder()
                .setType(AccountCreateParams.Type.EXPRESS)
                .setCountry("US")
                .setEmail(driver.getEmail())
                .build();
        Account account = Account.create(params);
        driver.setStripeAccountId(account.getId());
        driverRepository.save(driver);
    }

    public PaymentIntent processPayment(String customerId, String accountId, long amountInCents) throws StripeException {
        PaymentIntentCreateParams.TransferData transferData =
                PaymentIntentCreateParams.TransferData.builder()
                        .setDestination(accountId)
                        .build();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .setCustomer(customerId)
                .setTransferData(transferData)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .setAllowRedirects(PaymentIntentCreateParams.AutomaticPaymentMethods.AllowRedirects.NEVER)
                                .build()
                )
                .build();

        return PaymentIntent.create(params);
    }
}
