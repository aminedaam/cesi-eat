package com.cesieats.microservicerestaurant.error;

public class MenuNotFoundException extends Exception {

    public MenuNotFoundException(String message) {
        super(message);
    }

}
