package com.cesieats.microservicerestaurant.error;

public class ArticleNotFoundException extends Exception {
    public ArticleNotFoundException(String message) {
        super(message);
    }
}
