package com.espe.authors_service;

import com.espe.authors_service.dto.AuthorCreateRequest;
import com.espe.authors_service.dto.AuthorResponse;

import java.util.List;

public interface AuthorService {
    AuthorResponse create(AuthorCreateRequest request);
    List<AuthorResponse> findAll();
    AuthorResponse findById(Long id);
    AuthorResponse update(Long id, AuthorCreateRequest request);
    void delete(Long id);
}
