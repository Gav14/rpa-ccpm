package com.rpa.backend.dto;

import com.rpa.backend.model.Parentesco;
import com.rpa.backend.model.Sexo;

import java.time.LocalDate;

/**
 * Familiar tal como lo devuelve la API. A diferencia de FamiliarRequest,
 * incluye el id generado por la base de datos.
 */
public record FamiliarResponse(
        Long id,
        String apellido,
        String nombre,
        Sexo sexo,
        String dni,
        LocalDate fechaNacimiento,
        Parentesco parentesco
) {}
