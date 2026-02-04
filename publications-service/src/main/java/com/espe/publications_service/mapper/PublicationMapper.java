package com.espe.publications_service.mapper;

import com.espe.publications_service.domain.ArticlePublication;
import com.espe.publications_service.domain.Publication;
import com.espe.publications_service.dto.AuthorDto;
import com.espe.publications_service.dto.PublicationResponse;

public class PublicationMapper {

    public static PublicationResponse toResponse(Publication p, AuthorDto author) {
        PublicationResponse res = new PublicationResponse();
        res.setId(p.getId());
        res.setAuthorId(p.getAuthorId());
        res.setTitle(p.getTitle());
        res.setContent(p.getContent());
        res.setStatus(p.getStatus().name());
        res.setCreatedAt(p.getCreatedAt());
        res.setAuthor(author);

        if (p instanceof ArticlePublication a) {
            res.setPublicationType("ARTICLE");
            res.setCategory(a.getCategory());
        } else {
            res.setPublicationType("UNKNOWN");
        }
        return res;
    }
}
