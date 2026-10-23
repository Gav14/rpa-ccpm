package com.rpa.backend.controller;

import com.rpa.backend.dto.CultivoRequest;
import com.rpa.backend.model.Cultivo;
import com.rpa.backend.service.CultivoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cultivos")
@Tag(name = "Cultivos", description = "Gestión del catálogo de cultivos. Un cultivo puede estar asociado a varios productores.")
public class CultivoController {

    private final CultivoService cultivoService;

    public CultivoController(CultivoService cultivoService) {
        this.cultivoService = cultivoService;
    }

    @Operation(summary = "Listar todos los cultivos",
            description = "Devuelve el catálogo completo de cultivos registrados.")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping
    public List<Cultivo> listar() {
        return cultivoService.listar();
    }

    @Operation(summary = "Crear un nuevo cultivo",
            description = "Registra un cultivo. El nombre debe ser único (no se permiten duplicados).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cultivo creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos (nombre vacío o demasiado largo)"),
            @ApiResponse(responseCode = "409", description = "Ya existe un cultivo con ese nombre")
    })
    @PostMapping
    public ResponseEntity<Cultivo> crear(@Valid @RequestBody CultivoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cultivoService.crear(request));
    }

    @Operation(summary = "Eliminar un cultivo",
            description = "Elimina un cultivo del catálogo por su ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Cultivo eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "No existe un cultivo con ese ID")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        cultivoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}