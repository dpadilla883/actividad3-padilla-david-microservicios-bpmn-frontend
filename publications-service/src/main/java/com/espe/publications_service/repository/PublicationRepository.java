package com.espe.publications_service.repository;

import com.espe.publications_service.domain.EditorialStatus;
import com.espe.publications_service.domain.Publication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByAuthorId(Long authorId);
    List<Publication> findByStatus(EditorialStatus status);
    List<Publication> findByAuthorIdAndStatus(Long authorId, EditorialStatus status);
}
