package com.espe.publications_service.factory;

import com.espe.publications_service.domain.ArticlePublication;
import com.espe.publications_service.domain.Publication;
import com.espe.publications_service.dto.PublicationCreateRequest;
import com.espe.publications_service.exception.BadRequestException;

public class PublicationFactory {

    public static Publication from(PublicationCreateRequest req) {
        String type = req.getPublicationType() == null ? "" : req.getPublicationType().trim().toUpperCase();

        if ("ARTICLE".equals(type)) {
            ArticlePublication p = new ArticlePublication();
            p.setAuthorId(req.getAuthorId());
            p.setTitle(req.getTitle());
            p.setContent(req.getContent());
            p.setCategory(req.getCategory());
            return p;
        }

        throw new BadRequestException("publicationType inválido. Usa ARTICLE");
    }
}
