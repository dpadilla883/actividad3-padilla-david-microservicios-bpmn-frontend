package com.espe.authors_service.mapper;

import com.espe.authors_service.domain.*;
import com.espe.authors_service.dto.AuthorResponse;

public class AuthorMapper {

    public static AuthorResponse toResponse(Author author) {
        AuthorResponse res = new AuthorResponse();
        res.setId(author.getId());
        res.setAuthorType(author.getAuthorType());

        if (author instanceof PersonAuthor p) {
            res.setFullName(p.getFullName());
            res.setEmail(p.getEmail());
        } else if (author instanceof OrganizationAuthor o) {
            res.setOrganizationName(o.getOrganizationName());
            res.setContactEmail(o.getContactEmail());
        }

        return res;
    }
}
