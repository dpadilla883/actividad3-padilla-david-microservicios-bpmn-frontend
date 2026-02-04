package com.espe.publications_service.client;

import com.espe.publications_service.dto.AuthorDto;
import java.util.Optional;

public interface AuthorsClient {
    Optional<AuthorDto> getAuthorById(Long id);
}
