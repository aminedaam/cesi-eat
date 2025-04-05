package com.cesieats.microservicerestaurant.service;

import com.cesieats.microservicerestaurant.enums.Categorie;
import com.cesieats.microservicerestaurant.entity.Restaurant;
import com.cesieats.microservicerestaurant.error.RestaurantNotFoundException;
import com.cesieats.microservicerestaurant.repository.RestaurantRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@AllArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {



    @Autowired
    private final RestaurantRepository restaurantRepository;


    @Override
    public List<Restaurant> getAllRestaurant() {
        return restaurantRepository.findAll();
    }

    @Override
    public List<Restaurant> findByCategorie(Categorie categorie) {
        return restaurantRepository.findByCategorie(categorie);
    }

    @Override
    public Restaurant findRestaurantById(Long id) throws RestaurantNotFoundException {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant non trouvé"));
    }


    @Override
    public Restaurant saveRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    @Override
    public void deleteRestaurant(Long id) throws RestaurantNotFoundException {
        if(restaurantRepository.findById(id).isEmpty()){
            throw new RestaurantNotFoundException("Restaurant non trouvé");
        }
        restaurantRepository.deleteById(id);
    }


    @Override
    public Restaurant updateRestaurant(Long id, Restaurant restaurant) {
        Restaurant existing = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant non trouvé"));

        existing.setName(restaurant.getName());
        existing.setAddress(restaurant.getAddress());
        existing.setCountry(restaurant.getCountry());
        existing.setCity(restaurant.getCity());
        existing.setLongitude(restaurant.getLongitude());
        existing.setLatitude(restaurant.getLatitude());
        existing.setImagePath(restaurant.getImagePath());
        existing.setDescription(restaurant.getDescription());
        existing.setDelevryCost(restaurant.getDelevryCost());
        existing.setEmail(restaurant.getEmail());
        existing.setCreated_date(restaurant.getCreated_date());
        existing.setOppeningHours(restaurant.getOppeningHours());
        existing.setClosingTime(restaurant.getClosingTime());
        existing.setPhoneNumber(restaurant.getPhoneNumber());
        existing.setAverageRate(restaurant.getAverageRate());
        existing.setCategorie(restaurant.getCategorie());
        existing.setNbRate(restaurant.getNbRate());
        return restaurantRepository.save(existing);
    }

    @Override
    public List<Restaurant> getMyRestaurants(String email) throws RestaurantNotFoundException {
        return restaurantRepository.findByCreatorEmail(email);
    }

    @Override
    public List<Restaurant> findRestaurantByName(String name) throws RestaurantNotFoundException {
        List<Restaurant> restaurants = restaurantRepository.findByName(name);
        if (restaurants.isEmpty()) {
            throw new RestaurantNotFoundException("Aucun restaurant trouvé avec ce nom");
        }
        return restaurants;
    }
}
