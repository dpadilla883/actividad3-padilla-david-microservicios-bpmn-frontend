package com.espe.publications_service.dto;

public class AuthorDto {
    private Long id;
    private String authorType;
    private String fullName;
    private String email;
    private String organizationName;
    private String contactEmail;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAuthorType() { return authorType; }
    public void setAuthorType(String authorType) { this.authorType = authorType; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
}
