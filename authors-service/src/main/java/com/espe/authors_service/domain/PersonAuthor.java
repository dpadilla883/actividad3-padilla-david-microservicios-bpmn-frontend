package com.espe.authors_service.domain;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("PERSON")
public class PersonAuthor extends Author {

    @Column(name = "full_name") // NULL en BD (validamos en Service)
    private String fullName;

    @Column(name = "email") // NULL en BD (validamos en Service)
    private String email;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
