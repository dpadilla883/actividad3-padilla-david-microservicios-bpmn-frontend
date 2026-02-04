package com.espe.authors_service.domain;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ORG")
public class OrganizationAuthor extends Author {

    @Column(name = "organization_name") // NULL en BD (validamos en Service)
    private String organizationName;

    @Column(name = "contact_email") // NULL en BD (validamos en Service)
    private String contactEmail;

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
}

