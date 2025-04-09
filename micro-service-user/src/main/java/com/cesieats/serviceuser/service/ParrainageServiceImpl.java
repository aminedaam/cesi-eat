package com.cesieats.serviceuser.service;

import com.cesieats.serviceuser.entity.Parrainage;
import com.cesieats.serviceuser.exception.CodeParrainageAlreadyUsedException;
import com.cesieats.serviceuser.repository.ParrainageRepository;
import com.cesieats.serviceuser.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ParrainageServiceImpl implements ParrainageService {


    private final UserRepository userRepository;

    private final ParrainageRepository parrainageRepository;




    @Override
    public Parrainage createParrainage(Parrainage parrainage) throws CodeParrainageAlreadyUsedException {
        if (parrainage.getParrain() == null || parrainage.getUtilisateurParraine() == null) {
            throw new CodeParrainageAlreadyUsedException("Le parrain et l'utilisateur parrainé ne peuvent pas être nuls");
        }

        if (parrainage.getParrain().getId().equals(parrainage.getUtilisateurParraine().getId())) {
            throw new IllegalArgumentException("L'utilisateur ne peut pas se parrainer lui-même.");
        }
        return parrainageRepository.save(parrainage);
    }


    @Override
    public List<Parrainage> getAllParrainages() {
        return parrainageRepository.findAll();
    }


}
