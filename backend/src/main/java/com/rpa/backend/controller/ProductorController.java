package com.rpa.backend.controller;

import com.rpa.backend.dto.ProductorRequest;
import com.rpa.backend.dto.ProductorResponse;
import com.rpa.backend.model.Sexo;
import com.rpa.backend.service.ProductorService;
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
@RequestMapping("/api/productores")
@Tag(name = "Productores",
        description = "Operaciones relacionadas con los productores agrarios")
public class ProductorController {

    private final ProductorService productorService;

    public ProductorController(ProductorService productorService) {
        this.productorService = productorService;
    }

    @Operation(summary = "Listar o filtrar productores",
            description = "Devuelve productores aplicando filtros combinables opcionales. "
                    + "Todos los parámetros son opcionales y se combinan con AND. "
                    + "Los filtros de apellido, nombre y cultivo son parciales (LIKE).")
    @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente")
    @GetMapping
    public List<ProductorResponse> listar(
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) Sexo sexo,
            @RequestParam(required = false) String departamento,
            @RequestParam(required = false) String municipio,
            @RequestParam(required = false) String cultivo) {

        return productorService.buscar(apellido, nombre, dni, sexo,
                departamento, municipio, cultivo);
    }

    @Operation(summary = "Obtener un productor por ID",
            description = "Devuelve el detalle completo de un productor, incluyendo sus cultivos y grupo familiar.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Productor encontrado"),
            @ApiResponse(responseCode = "404", description = "No existe un productor con ese ID")
    })
    @GetMapping("/{id}")
    public ProductorResponse detalle(@PathVariable Long id) {
        return productorService.buscarPorId(id);
    }

    @Operation(summary = "Crear un nuevo productor",
            description = "Registra un productor con sus cultivos y familiares asociados. "
                    + "El DNI debe ser único en el sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Productor creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos (campos obligatorios faltantes o mal formados)"),
            @ApiResponse(responseCode = "409", description = "Ya existe un productor con ese DNI")
    })
    @PostMapping
    public ResponseEntity<ProductorResponse> crear(
            @Valid @RequestBody ProductorRequest request) {
        ProductorResponse creado = productorService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @Operation(summary = "Actualizar un productor existente",
            description = "Modifica los datos de un productor. Si se envían cultivos y familiares, "
                    + "reemplazan a los existentes.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Productor actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "No existe un productor con ese ID"),
            @ApiResponse(responseCode = "409", description = "El DNI ya está en uso por otro productor")
    })
    @PutMapping("/{id}")
    public ProductorResponse actualizar(@PathVariable Long id,
                                        @Valid @RequestBody ProductorRequest request) {
        return productorService.actualizar(id, request);
    }

    @Operation(summary = "Eliminar un productor",
            description = "Elimina un productor y, por cascade, sus familiares y asociaciones con cultivos.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Productor eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "No existe un productor con ese ID")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}