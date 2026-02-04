package com.espe.publications_service.dto;

import jakarta.validation.constraints.NotBlank;

public class PublicationStatusRequest {

    @NotBlank
    private String status;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
