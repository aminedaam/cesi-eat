package com.cesieats.serviceuser.service;

import com.cesieats.serviceuser.entity.Parrainage;

public interface ParrainageService {
    String generateCodeParrainage(String email);
    void saveParrainage(Parrainage parrainage);
    boolean isCodeParrainageUsed(String codeParrainage);
}
