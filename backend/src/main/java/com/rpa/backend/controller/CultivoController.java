package com.rpa.backend.controller;

import com.rpa.backend.model.Cultivo;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public class CultivoController {
    @RestController
    @RequestMapping("/api/cultivos")
    public class CultivoController {

        private final CultivoService cultivoService;

        public CultivoController(CultivoService cultivoService) {
            this.cultivoService = cultivoService;
        }

        @GetMapping
        public List<Cultivo> listar() {
            return cultivoService.listar();
        }

        @PostMapping
        public ResponseEntity<Cultivo> crear(@Valid @RequestBody CultivoRequest request) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(cultivoService.crear(request));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> eliminar(@PathVariable Long id) {
            cultivoService.eliminar(id);
            return ResponseEntity.noContent().build();
        }
    }
}
