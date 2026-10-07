package com.rpa.backend.service.impl;

import com.rpa.backend.repository.CultivoRepository;
import com.rpa.backend.repository.FamiliarRepository;
import com.rpa.backend.repository.ProductorRepository;
import com.rpa.backend.service.EstadisticasService;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class EstadisticasServiceImpl implements EstadisticasService {
    private final ProductorRepository productorRepository;
    private final CultivoRepository cultivoRepository;
    private final FamiliarRepository familiarRepository;

    public EstadisticasServiceImpl(ProductorRepository productorRepository, CultivoRepository cultivoRepository, FamiliarRepository familiarRepository) {
        this.productorRepository = productorRepository;
        this.cultivoRepository = cultivoRepository;
        this.familiarRepository = familiarRepository;
    }

    public Map<String, Object> obtenerEstadisticas() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalProductores", productorRepository.count());
        stats.put("totalCultivos", cultivoRepository.count());
        stats.put("totalFamiliares", familiarRepository.count());
        stats.put("promedioFamiliaresPorProductor",
                familiarRepository.promedioFamiliaresPorProductor());
        stats.put("porDepartamento", aMapa(productorRepository.contarPorDepartamento()));
        stats.put("porMunicipio", aMapa(productorRepository.contarPorMunicipio()));
        stats.put("porSexo", aMapa(productorRepository.contarPorSexo()));
        stats.put("porCultivo", aMapa(productorRepository.contarPorCultivo()));
        stats.put("porParentesco", aMapa(familiarRepository.contarPorParentesco()));

        return stats;
    }

    private Map<String, Long> aMapa(List<Object[]> filas) {
        Map<String, Long> mapa = new LinkedHashMap<>();
        for (Object[] fila : filas) {
            mapa.put(fila[0].toString(), (Long) fila[1]);
        }
        return mapa;
    }
}
