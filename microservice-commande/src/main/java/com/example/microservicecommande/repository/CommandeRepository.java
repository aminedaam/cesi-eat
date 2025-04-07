package com.example.microservicecommande.repository;

import com.example.microservicecommande.entity.Commande;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommandeRepository extends MongoRepository<Commande, String> {

}
