package com.cesieats.microservicerestaurant.service;

import com.cesieats.microservicerestaurant.entity.Menu;
import com.cesieats.microservicerestaurant.error.MenuNotFoundException;
import com.cesieats.microservicerestaurant.repository.MenuRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MenuServiceImpl implements MenuService{

    private MenuRepository menuRepository;
    @Override
    public List<Menu> getAllMenu() {
        return null;
    }

    @Override
    public Menu getMenuByName(String name) {
        return menuRepository.findByName(name);
    }

    @Override
    public List<Menu> getMenuByRestaurantId(Long restaurantId) {
        return menuRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public Menu findMenuById(Long id) throws MenuNotFoundException {
        return menuRepository.findById(id)
                .orElseThrow(() -> new MenuNotFoundException("Menu non trouvé"));
    }

    @Override
    public Menu createMenu(Menu menu) {
        return menuRepository.save(menu);
    }

    @Override
    public void deleteMenu(Long id) throws MenuNotFoundException {
        if (!menuRepository.existsById(id)) {
            throw new MenuNotFoundException("Menu non trouvé");
        }
        menuRepository.deleteById(id);
    }

    @Override
    public Menu updateMenu(Long id, Menu menu) throws MenuNotFoundException {
        Menu existing = menuRepository.findById(id)
                .orElseThrow(() -> new MenuNotFoundException("Menu non trouvé"));
        existing.setName(menu.getName());
        existing.setDescription(menu.getDescription());
        existing.setRestaurant(menu.getRestaurant());
        return menuRepository.save(existing);
    }
}
