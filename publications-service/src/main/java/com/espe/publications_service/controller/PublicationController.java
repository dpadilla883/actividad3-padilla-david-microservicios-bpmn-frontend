package com.espe.publications_service.controller;

import com.espe.publications_service.dto.*;
import com.espe.publications_service.service.PublicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/publications")
public class PublicationController {

    private final PublicationService service;

    public PublicationController(PublicationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PublicationResponse> create(@Valid @RequestBody PublicationCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping("/{id}")
    public PublicationResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<PublicationResponse> list(
            @RequestParam(required = false) Long authorId,
            @RequestParam(required = false) String status
    ) {
        return service.list(Optional.ofNullable(authorId), Optional.ofNullable(status));
    }

    @PutMapping("/{id}")
    public PublicationResponse update(@PathVariable Long id, @Valid @RequestBody PublicationUpdateRequest req) {
        return service.update(id, req);
    }

    @PatchMapping("/{id}/status")
    public PublicationResponse changeStatus(@PathVariable Long id, @Valid @RequestBody PublicationStatusRequest req) {
        return service.changeStatus(id, req.getStatus());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build(); // 204
    }
}
