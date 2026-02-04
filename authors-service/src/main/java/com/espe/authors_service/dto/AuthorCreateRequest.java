package com.espe.authors_service.dto;

import com.espe.authors_service.domain.AuthorType;
import jakarta.validation.constraints.NotNull;

public class AuthorCreateRequest {

    @NotNull(message = "authorType es obligatorio (PERSON u ORG)")
    private AuthorType authorType;

    private String fullName;
    private String email;

    private String organizationName;
    private String contactEmail;

    public AuthorType getAuthorType() { return authorType; }
    public void setAuthorType(AuthorType authorType) { this.authorType = authorType; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
}

