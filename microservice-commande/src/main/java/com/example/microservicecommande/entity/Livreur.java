package com.example.microservicecommande.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Livreur {

    private long id;

    private String name;

    private double latitude;

    private double longitude;

    private String phoneNumber;


}
