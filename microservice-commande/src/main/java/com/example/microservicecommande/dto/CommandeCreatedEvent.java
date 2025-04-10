package com.example.microservicecommande.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandeCreatedEvent implements Serializable {

    private String commandeId;
    private long clientId;
    private long restaurantId;
    private boolean promotion;
    private String status;


}
