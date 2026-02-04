package com.espe.publications_service.service;

import com.espe.publications_service.domain.EditorialStatus;
import com.espe.publications_service.exception.BadRequestException;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

@Component
public class StatusTransitionValidator {

    private final Map<EditorialStatus, Set<EditorialStatus>> allowed = new EnumMap<>(EditorialStatus.class);

    public StatusTransitionValidator() {
        allowed.put(EditorialStatus.DRAFT, EnumSet.of(EditorialStatus.IN_REVIEW));
        allowed.put(EditorialStatus.IN_REVIEW, EnumSet.of(EditorialStatus.APPROVED, EditorialStatus.REJECTED));
        allowed.put(EditorialStatus.APPROVED, EnumSet.of(EditorialStatus.PUBLISHED));
        allowed.put(EditorialStatus.REJECTED, EnumSet.of(EditorialStatus.DRAFT));
        allowed.put(EditorialStatus.PUBLISHED, EnumSet.noneOf(EditorialStatus.class));
    }

    public void validate(EditorialStatus current, EditorialStatus next) {
        Set<EditorialStatus> targets = allowed.getOrDefault(current, EnumSet.noneOf(EditorialStatus.class));
        if (!targets.contains(next)) {
            throw new BadRequestException("Transición inválida: " + current + " -> " + next);
        }
    }
}
