package com.rpa.backend.service.impl;

import com.rpa.backend.repository.CultivoRepository;
import com.rpa.backend.repository.FamiliarRepository;
import com.rpa.backend.repository.ProductorRepository;
import com.rpa.backend.service.EstadisticasService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
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

        long totalProductores = productorRepository.count();
        long totalFamiliares = familiarRepository.count();

        stats.put("totalProductores", totalProductores);
        stats.put("totalCultivos", cultivoRepository.count());
        stats.put("totalFamiliares", totalFamiliares);
        // Promedio sobre TODOS los productores (los que no tienen familiares cuentan como 0).
        // Si no hay productores, se devuelve null para no dividir por cero.
        stats.put("promedioFamiliaresPorProductor",
                totalProductores == 0 ? null : (double) totalFamiliares / totalProductores);
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
