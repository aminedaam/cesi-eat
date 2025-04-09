package com.cesieats.serviceuser.service;

import com.cesieats.serviceuser.entity.Parrainage;
import com.cesieats.serviceuser.exception.CodeParrainageAlreadyUsedException;

import java.util.List;

public interface ParrainageService {
    Parrainage createParrainage(Parrainage parrainage) throws CodeParrainageAlreadyUsedException;


    List<Parrainage> getAllParrainages();
}
