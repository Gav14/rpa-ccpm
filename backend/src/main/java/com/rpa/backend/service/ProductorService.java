package com.rpa.backend.service;

import com.rpa.backend.dto.ProductorRequest;
import com.rpa.backend.dto.ProductorResponse;
import com.rpa.backend.model.Sexo;

import java.util.List;

public interface ProductorService {
    ProductorResponse crear(ProductorRequest request);
    List<ProductorResponse> buscar(String apellido, String nombre, String dni, Sexo sexo, String departamento, String municipio, String cultivo);
    ProductorResponse buscarPorId(Long id);
    ProductorResponse actualizar(Long id, ProductorRequest request);
    void eliminar(Long id);
}
