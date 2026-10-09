package com.rpa.backend.controller;

import com.rpa.backend.service.EstadisticasService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/estadisticas")
@Tag(name = "Estadísticas",
        description = "Reportes e indicadores agregados sobre productores, cultivos y grupos familiares.")
public class EstadisticasController {

    private final EstadisticasService estadisticasService;

    public EstadisticasController(EstadisticasService estadisticasService) {
        this.estadisticasService = estadisticasService;
    }

    @Operation(summary = "Obtener todas las estadísticas",
            description = "Devuelve totales y distribuciones: productores por departamento, "
                    + "municipio y sexo, productores por cultivo, familiares por parentesco, "
                    + "y promedio de familiares por productor.")
    @ApiResponse(responseCode = "200", description = "Estadísticas calculadas correctamente")
    @GetMapping
    public Map<String, Object> obtener() {
        return estadisticasService.obtenerEstadisticas();
    }
}