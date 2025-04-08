package com.cesieats.microservicerestaurant.service;

import com.cesieats.microservicerestaurant.entity.Article;
import com.cesieats.microservicerestaurant.entity.Menu;
import com.cesieats.microservicerestaurant.error.ArticleNotFoundException;
import com.cesieats.microservicerestaurant.error.MenuNotFoundException;
import com.cesieats.microservicerestaurant.repository.ArticleRepository;
import com.cesieats.microservicerestaurant.repository.MenuRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MenuServiceImpl implements MenuService{

    private MenuRepository menuRepository;
    private ArticleRepository articleRepository;
    @Override
    public List<Menu> getAllMenu() {
        return menuRepository.findAll();
    }

    @Override
    public Menu getMenuByName(String name) throws MenuNotFoundException {
        if(menuRepository.findByName(name) == null){
            throw new MenuNotFoundException("Menu non trouvé");
        }
        return menuRepository.findByName(name);
    }

    @Override
    public List<Menu> getMenuByRestaurantId(Long restaurantId) throws MenuNotFoundException {
        List<Menu> menus = menuRepository.findByRestaurant_Id(restaurantId);
        if(menus.isEmpty()){
            throw new MenuNotFoundException("Aucun menu trouvé pour ce restaurant");
        }
        return menus;
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
    public void deleteMenu(Long id) throws MenuNotFoundException, ArticleNotFoundException {
        if (!menuRepository.existsById(id)) {
            throw new MenuNotFoundException("Menu non trouvé");
        }
        // on autorise la suppression d'un menu même si il a des articles associés
        if(!articleRepository.findByMenu_Id(id).isEmpty()){
            List<Article> articlesDeleted = articleRepository.findByMenu_Id(id);
            for (Article article : articlesDeleted) {
                articleRepository.delete(article);
            }
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
