package com.espe.publications_service.service;

import com.espe.publications_service.client.AuthorsClient;
import com.espe.publications_service.domain.ArticlePublication;
import com.espe.publications_service.domain.EditorialStatus;
import com.espe.publications_service.domain.Publication;
import com.espe.publications_service.dto.*;
import com.espe.publications_service.exception.BadRequestException;
import com.espe.publications_service.exception.NotFoundException;
import com.espe.publications_service.factory.PublicationFactory;
import com.espe.publications_service.mapper.PublicationMapper;
import com.espe.publications_service.repository.PublicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PublicationService {

    private final PublicationRepository repository;
    private final AuthorsClient authorsClient;
    private final StatusTransitionValidator validator;

    public PublicationService(PublicationRepository repository, AuthorsClient authorsClient, StatusTransitionValidator validator) {
        this.repository = repository;
        this.authorsClient = authorsClient;
        this.validator = validator;
    }

    public PublicationResponse create(PublicationCreateRequest request) {
        AuthorDto author = authorsClient.getAuthorById(request.getAuthorId())
                .orElseThrow(() -> new NotFoundException("Autor no existe: id=" + request.getAuthorId()));

        Publication p = PublicationFactory.from(request);
        Publication saved = repository.save(p);

        return PublicationMapper.toResponse(saved, author);
    }

    public PublicationResponse getById(Long id) {
        Publication p = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Publicación no existe: id=" + id));

        AuthorDto author = authorsClient.getAuthorById(p.getAuthorId()).orElse(null);
        return PublicationMapper.toResponse(p, author);
    }

    public List<PublicationResponse> list(Optional<Long> authorId, Optional<String> status) {
        List<Publication> pubs;

        Optional<EditorialStatus> st = status.map(s -> EditorialStatus.valueOf(s.trim().toUpperCase()));

        if (authorId.isPresent() && st.isPresent()) {
            pubs = repository.findByAuthorIdAndStatus(authorId.get(), st.get());
        } else if (authorId.isPresent()) {
            pubs = repository.findByAuthorId(authorId.get());
        } else if (st.isPresent()) {
            pubs = repository.findByStatus(st.get());
        } else {
            pubs = repository.findAll();
        }

        return pubs.stream().map(p -> {
            AuthorDto author = authorsClient.getAuthorById(p.getAuthorId()).orElse(null);
            return PublicationMapper.toResponse(p, author);
        }).toList();
    }

    /** PUT: actualiza datos (sin tocar status) */
    public PublicationResponse update(Long id, PublicationUpdateRequest req) {
        Publication p = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Publicación no existe: id=" + id));

        String typeReq = req.getPublicationType().trim().toUpperCase();
        String typeActual = (p instanceof ArticlePublication) ? "ARTICLE" : "UNKNOWN";

        if (!typeActual.equals(typeReq)) {
            throw new BadRequestException("No puedes cambiar el tipo de publicación. Actual=" + typeActual + ", req=" + typeReq);
        }

        // Validar autor (si cambiaste authorId, igual lo validamos)
        AuthorDto author = authorsClient.getAuthorById(req.getAuthorId())
                .orElseThrow(() -> new NotFoundException("Autor no existe: id=" + req.getAuthorId()));

        p.setAuthorId(req.getAuthorId());
        p.setTitle(req.getTitle());
        p.setContent(req.getContent());

        if (p instanceof ArticlePublication a) {
            a.setCategory(req.getCategory());
        }

        Publication saved = repository.save(p);
        return PublicationMapper.toResponse(saved, author);
    }

    public PublicationResponse changeStatus(Long id, String newStatus) {
        Publication p = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Publicación no existe: id=" + id));

        EditorialStatus next = EditorialStatus.valueOf(newStatus.trim().toUpperCase());
        validator.validate(p.getStatus(), next);

        p.setStatus(next);
        Publication saved = repository.save(p);

        AuthorDto author = authorsClient.getAuthorById(saved.getAuthorId()).orElse(null);
        return PublicationMapper.toResponse(saved, author);
    }

    /** DELETE */
    public void delete(Long id) {
        Publication p = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Publicación no existe: id=" + id));
        repository.delete(p);
    }
}
