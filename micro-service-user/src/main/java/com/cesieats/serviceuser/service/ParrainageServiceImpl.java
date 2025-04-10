package com.cesieats.serviceuser.service;

import com.cesieats.serviceuser.dto.ParrainageDto;
import com.cesieats.serviceuser.entity.Parrainage;
import com.cesieats.serviceuser.entity.User;
import com.cesieats.serviceuser.exception.CodeParrainageAlreadyUsedException;
import com.cesieats.serviceuser.exception.UserNotFoundException;
import com.cesieats.serviceuser.repository.ParrainageRepository;
import com.cesieats.serviceuser.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ParrainageServiceImpl implements ParrainageService {


    private final UserRepository userRepository;

    private final ParrainageRepository parrainageRepository;




//    @Override
//    public boolean parrainer(Long idUser) {
//        Parrainage parrainage = parrainageRepository.findById(idParrainage).orElseThrow(() -> new IllegalArgumentException("Parrainage non trouvé"));
//        if (parrainage.getUtilisateurParraine() != null) {
//            return false; // Le parrainage a déjà été utilisé
//        }
//        parrainage.setUtilisateurParraine(userRepository.findById(idUser).orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé")));
//        parrainageRepository.save(parrainage);
//        return true;
//    }
    @Override
    public void updatePromotion(long idParrainage, boolean isUsed) {
        Parrainage parrainage = parrainageRepository.findById(idParrainage).orElseThrow(() -> new IllegalArgumentException("Parrainage non trouvé"));
        parrainage.setPromotion(isUsed);
        parrainageRepository.save(parrainage);
    }
    @Override
    public Parrainage createParrainage(ParrainageDto parrainage) throws CodeParrainageAlreadyUsedException, UserNotFoundException{


        User parrainne = userRepository.findById(parrainage.getIdParrainne())
                .orElseThrow(() -> new UserNotFoundException("L'utilisateur parrainé n'existe pas"));

        User parrain = userRepository.findByCodeParrainage(parrainage.getCodeParrainage());

        if (parrain.getId() == parrainage.getIdParrainne()) {
            throw new IllegalArgumentException("L'utilisateur ne peut pas se parrainer lui-même.");
        }
        if(parrain == null ){
            throw new UserNotFoundException("Le parrain n'existe pas");
        }
        if(!parrainage.getCodeParrainage().equals(parrain.getCodeParrainage())){
            throw new CodeParrainageAlreadyUsedException("Erreur sur le code de parrainage");
        }
        Parrainage createParrainage = new Parrainage(parrainne, parrain, false);

        return parrainageRepository.save(createParrainage);
    }


    @Override
    public List<Parrainage> getAllParrainages() {
        return parrainageRepository.findAll();
    }

    @Override
    public Parrainage findByParrainneId(Long idParrainne) throws UserNotFoundException {
        return parrainageRepository.findAll().stream()
                .filter(parrainage -> parrainage.getUtilisateurParraine().getId().equals(idParrainne))
                .findFirst()
                .orElseThrow(() -> new UserNotFoundException("Aucun parrainage trouvé pour l'utilisateur avec l'ID : " + idParrainne));
    }





}
