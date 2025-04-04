package com.cesieats.microservicerestaurant.service;

import com.cesieats.microservicerestaurant.entity.Article;
import com.cesieats.microservicerestaurant.enums.Produit;
import com.cesieats.microservicerestaurant.error.ArticleNotFoundException;
import com.cesieats.microservicerestaurant.error.ProduitNotFoundException;
import com.cesieats.microservicerestaurant.repository.ArticleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;

    public ArticleServiceImpl(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }


    @Override
    public List<Article> getAllArticle() {
        return articleRepository.findAll();
    }

    @Override
    public Article findArticleById(Long id) throws ArticleNotFoundException {
        return articleRepository.findById(id).orElse(null);
    }


    @Override
    public List<Article> getArticleByProduit(Produit typeProduit) throws ProduitNotFoundException {
        List<Article> articles =  articleRepository.findByTypeProd(typeProduit);
        if(typeProduit == null) {
            throw new ProduitNotFoundException("Produit non trouvé");
        }
        return articles;
    }


    @Override
    public Article saveArticle(Article article) {
        articleRepository.save(article);
        return article;
    }

    @Override
    public void deleteArticle(Long id) throws ArticleNotFoundException {
        if(!articleRepository.existsById(id)) {
            throw new ArticleNotFoundException("Article non trouvé");
        }
        articleRepository.deleteById(id);
    }

    @Override
    public Article updateArticle(Long id, Article article) throws ArticleNotFoundException {
        Article existingArticle = articleRepository.findById(id).orElseThrow(() -> new ArticleNotFoundException("Article non trouvé"));
        existingArticle.setName(article.getName());
        existingArticle.setDescription(article.getDescription());
        existingArticle.setImagePath(article.getImagePath());
        existingArticle.setPrice(article.getPrice());
        existingArticle.setTypeProd(article.getTypeProd());
        return articleRepository.save(existingArticle);
    }
}
