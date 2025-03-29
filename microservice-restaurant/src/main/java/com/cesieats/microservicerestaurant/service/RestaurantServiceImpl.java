package com.cesieats.microservicerestaurant.service;

import com.cesieats.microservicerestaurant.dto.RestaurantDTO;
import com.cesieats.microservicerestaurant.entity.Categorie;
import com.cesieats.microservicerestaurant.entity.Restaurant;
import com.cesieats.microservicerestaurant.error.RestaurantNotFoundException;
import com.cesieats.microservicerestaurant.repository.RestaurantRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;

    @Override
    public List<RestaurantDTO> getAllRestaurant() {
        return restaurantRepository.findAll().stream()
                .map(restaurant -> new RestaurantDTO(
                        restaurant.getName(),
                        restaurant.getAdress(),
                        restaurant.getCountry(),
                        restaurant.getCity(),
                        restaurant.getDescription(),
                        restaurant.getEmail(),
                        restaurant.getImagePath()))
                .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantDTO> getRestaurantByCategorie(Categorie categorie) {
        return restaurantRepository.findAll().stream()
                .filter(restaurant -> restaurant.getCategorie().equals(categorie))
                .map(restaurant -> new RestaurantDTO(
                        restaurant.getName(),
                        restaurant.getAdress(),
                        restaurant.getCountry(),
                        restaurant.getCity(),
                        restaurant.getDescription(),
                        restaurant.getEmail(),
                        restaurant.getImagePath()))
                .collect(Collectors.toList());
    }

    @Override
    public Restaurant saveRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    @Override
    public void deleteRestaurant(Long id) throws RestaurantNotFoundException {
        restaurantRepository.deleteById(id);
    }

    @Override
    public RestaurantDTO updateRestaurant(Long id, RestaurantDTO restaurantDto) throws RestaurantNotFoundException {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found"));

        if (restaurantDto.getName() != null) restaurant.setName(restaurantDto.getName());
        if (restaurantDto.getAdress() != null) restaurant.setAdress(restaurantDto.getAdress());
        if (restaurantDto.getCountry() != null) restaurant.setCountry(restaurantDto.getCountry());
        if (restaurantDto.getCity() != null) restaurant.setCity(restaurantDto.getCity());
        if (restaurantDto.getDescription() != null) restaurant.setDescription(restaurantDto.getDescription());
        if (restaurantDto.getEmail() != null) restaurant.setEmail(restaurantDto.getEmail());
        if (restaurantDto.getImagePath() != null) restaurant.setImagePath(restaurantDto.getImagePath());

        return new RestaurantDTO(restaurantRepository.save(restaurant));

    }
}
