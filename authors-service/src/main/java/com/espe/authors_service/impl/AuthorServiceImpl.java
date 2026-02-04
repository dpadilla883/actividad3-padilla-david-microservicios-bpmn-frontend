package com.espe.authors_service.impl;

import com.espe.authors_service.domain.*;
import com.espe.authors_service.dto.AuthorCreateRequest;
import com.espe.authors_service.dto.AuthorResponse;
import com.espe.authors_service.exception.NotFoundException;
import com.espe.authors_service.mapper.AuthorMapper;
import com.espe.authors_service.repository.AuthorRepository;
import com.espe.authors_service.AuthorService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository repository;

    public AuthorServiceImpl(AuthorRepository repository) {
        this.repository = repository;
    }

    @Override
    public AuthorResponse create(AuthorCreateRequest request) {
        Author author = buildAuthorFromRequest(request);
        Author saved = repository.save(author);
        return AuthorMapper.toResponse(saved);
    }

    @Override
    public List<AuthorResponse> findAll() {
        return repository.findAll().stream().map(AuthorMapper::toResponse).toList();
    }

    @Override
    public AuthorResponse findById(Long id) {
        Author author = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Author no encontrado con id=" + id));
        return AuthorMapper.toResponse(author);
    }

    @Override
    public AuthorResponse update(Long id, AuthorCreateRequest request) {
        Author existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Author no encontrado con id=" + id));

        // No permitir cambiar el tipo en UPDATE (evita inconsistencias con dtype y la herencia)
        if (request.getAuthorType() != null && request.getAuthorType() != existing.getAuthorType()) {
            throw new IllegalArgumentException("No se permite cambiar authorType en UPDATE. Crea uno nuevo si necesitas otro tipo.");
        }

        if (existing instanceof PersonAuthor p) {
            // PUT = reemplazo (requerimos datos completos)
            if (!StringUtils.hasText(request.getFullName())) {
                throw new IllegalArgumentException("fullName es obligatorio para authorType=PERSON");
            }
            if (!StringUtils.hasText(request.getEmail())) {
                throw new IllegalArgumentException("email es obligatorio para authorType=PERSON");
            }
            p.setFullName(request.getFullName().trim());
            p.setEmail(request.getEmail().trim());
        } else if (existing instanceof OrganizationAuthor o) {
            if (!StringUtils.hasText(request.getOrganizationName())) {
                throw new IllegalArgumentException("organizationName es obligatorio para authorType=ORG");
            }
            if (!StringUtils.hasText(request.getContactEmail())) {
                throw new IllegalArgumentException("contactEmail es obligatorio para authorType=ORG");
            }
            o.setOrganizationName(request.getOrganizationName().trim());
            o.setContactEmail(request.getContactEmail().trim());
        }

        Author saved = repository.save(existing);
        return AuthorMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        Author existing = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Author no encontrado con id=" + id));
        repository.delete(existing);
    }

    private Author buildAuthorFromRequest(AuthorCreateRequest request) {
        if (request.getAuthorType() == null) {
            throw new IllegalArgumentException("authorType es obligatorio (PERSON u ORG)");
        }

        if (request.getAuthorType() == AuthorType.PERSON) {
            if (!StringUtils.hasText(request.getFullName())) {
                throw new IllegalArgumentException("fullName es obligatorio para authorType=PERSON");
            }
            if (!StringUtils.hasText(request.getEmail())) {
                throw new IllegalArgumentException("email es obligatorio para authorType=PERSON");
            }

            PersonAuthor p = new PersonAuthor();
            p.setAuthorType(AuthorType.PERSON);
            p.setFullName(request.getFullName().trim());
            p.setEmail(request.getEmail().trim());
            return p;
        }

        if (request.getAuthorType() == AuthorType.ORG) {
            if (!StringUtils.hasText(request.getOrganizationName())) {
                throw new IllegalArgumentException("organizationName es obligatorio para authorType=ORG");
            }
            if (!StringUtils.hasText(request.getContactEmail())) {
                throw new IllegalArgumentException("contactEmail es obligatorio para authorType=ORG");
            }

            OrganizationAuthor o = new OrganizationAuthor();
            o.setAuthorType(AuthorType.ORG);
            o.setOrganizationName(request.getOrganizationName().trim());
            o.setContactEmail(request.getContactEmail().trim());
            return o;
        }

        throw new IllegalArgumentException("authorType inválido. Usa PERSON u ORG.");
    }
}

