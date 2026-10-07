package com.rpa.backend.controller;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticasController {

    private final EstadisticasService estadisticasService;

    public EstadisticasController(EstadisticasService estadisticasService) {
        this.estadisticasService = estadisticasService;
    }

    @GetMapping
    public Map<String, Object> obtener() {
        return estadisticasService.obtenerEstadisticas();
    }
}
