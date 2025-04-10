package com.cesieats.serviceuser.service;

import com.cesieats.serviceuser.dto.ParrainageDto;
import com.cesieats.serviceuser.entity.Parrainage;
import com.cesieats.serviceuser.exception.CodeParrainageAlreadyUsedException;
import com.cesieats.serviceuser.exception.UserNotFoundException;
import jakarta.validation.Valid;

import java.util.List;

public interface ParrainageService {
    Parrainage createParrainage(ParrainageDto parrainage) throws UserNotFoundException, CodeParrainageAlreadyUsedException;

    void updatePromotion(long idParrainage ,boolean isUsed);
    List<Parrainage> getAllParrainages();

    Parrainage findByParrainneId(Long idParrainne) throws UserNotFoundException;

}
