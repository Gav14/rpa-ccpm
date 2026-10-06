package com.rpa.backend.dto;

import com.rpa.backend.model.Sexo;

import java.time.LocalDate;
import java.util.List;

public record ProductorResponse(
        Long id,
        String apellido,
        String nombre,
        String dni,
        Sexo sexo,
        String tituloMaximo,
        LocalDate fechaNacimiento,
        String departamento,
        String municipio,
        String domicilio,
        List<String> cultivos,
        List<FamiliarRequest> familiares   // o un FamiliarResponse si preferís separar
) {}
