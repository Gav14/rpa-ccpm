package com.rpa.backend.controller;

import com.rpa.backend.dto.ProductorRequest;
import com.rpa.backend.dto.ProductorResponse;
import com.rpa.backend.model.Sexo;
import com.rpa.backend.service.ProductorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productores")
public class ProductorController {

    private final ProductorService productorService;

    public ProductorController(ProductorService productorService) {
        this.productorService = productorService;
    }

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

    @GetMapping("/{id}")
    public ProductorResponse detalle(@PathVariable Long id) {
        return productorService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<ProductorResponse> crear(
            @Valid @RequestBody ProductorRequest request) {
        ProductorResponse creado = productorService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ProductorResponse actualizar(@PathVariable Long id,
                                        @Valid @RequestBody ProductorRequest request) {
        return productorService.actualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
