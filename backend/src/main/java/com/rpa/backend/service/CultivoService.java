package com.rpa.backend.service;

import com.rpa.backend.dto.CultivoRequest;
import com.rpa.backend.model.Cultivo;

import java.util.List;

public interface CultivoService {
    Cultivo crear(CultivoRequest request);
    List<Cultivo> listar();
    void eliminar(Long id);

}
