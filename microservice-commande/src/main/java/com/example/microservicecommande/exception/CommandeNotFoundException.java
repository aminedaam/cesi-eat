package com.example.microservicecommande.exception;

public class CommandeNotFoundException extends Exception{
    public CommandeNotFoundException(String message) {
        super(message);
    }

}
