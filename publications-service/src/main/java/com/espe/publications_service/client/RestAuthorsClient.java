package com.espe.publications_service.client;

import com.espe.publications_service.dto.AuthorDto;
import com.espe.publications_service.exception.ExternalServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Component
public class RestAuthorsClient implements AuthorsClient {

    private final RestTemplate restTemplate;

    @Value("${authors.base-url}")
    private String authorsBaseUrl;

    public RestAuthorsClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public Optional<AuthorDto> getAuthorById(Long id) {
        try {
            String url = authorsBaseUrl + "/authors/" + id;
            ResponseEntity<AuthorDto> res = restTemplate.getForEntity(url, AuthorDto.class);
            return Optional.ofNullable(res.getBody());
        } catch (HttpClientErrorException.NotFound e) {
            return Optional.empty();
        } catch (ResourceAccessException e) {
            throw new ExternalServiceException("Authors Service no responde (timeout/no disponible).");
        } catch (Exception e) {
            throw new ExternalServiceException("Error consultando Authors Service: " + e.getMessage());
        }
    }
}
