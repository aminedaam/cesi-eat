package com.cesieats.serviceuser.service;

import com.cesieats.serviceuser.entity.Parrainage;
import com.cesieats.serviceuser.repository.ParrainageRepository;
import com.cesieats.serviceuser.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ParrainageServiceImpl implements ParrainageService {


    private final UserRepository userRepository;

    private final ParrainageRepository parrainageRepository;

    @Override
    public String generateCodeParrainage(String email) {
        StringBuilder code = new StringBuilder();
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (int i = 0; i < 10; i++) {
            int index = (int) (Math.random() * characters.length());
            code.append(characters.charAt(index));
        }
        if(isCodeParrainageUsed(code.toString())) {
            return generateCodeParrainage(email);
        }
        return code.toString();
    }


    @Override
    public void saveParrainage(Parrainage parrainage) {
        if(parrainage.getParrain() == null || parrainage.getUtilisateurParraine() == null) {
            throw new IllegalArgumentException("Le parrain et l'utilisateur parrainé ne peuvent pas être nuls");
        }
        parrainageRepository.save(parrainage);
    }

    @Override
    public boolean isCodeParrainageUsed(String codeParrainage) {
        return userRepository.findByCodeParrainage(codeParrainage) != null;

    }


    // Implement the methods from the ParrainageService interface here

}
