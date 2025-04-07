package com.example.microservicecommande;

import org.springframework.boot.SpringApplication;

public class TestMicroserviceCommandeApplication {

	public static void main(String[] args) {
		SpringApplication.from(MicroserviceCommandeApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
