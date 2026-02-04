package com.espe.publications_service.domain;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ARTICLE")
public class ArticlePublication extends Publication {

    @Column(name="category")
    private String category;

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
