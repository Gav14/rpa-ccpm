package com.rpa.backend.dto;

import com.rpa.backend.model.Sexo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public record ProductorRequest(
        @NotBlank(message = "El apellido es obligatorio")
        String apellido,

        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "El DNI es obligatorio")
        @Pattern(regexp = "\\d{7,10}", message = "El DNI debe tener entre 7 y 10 dígitos")
        String dni,

        @NotNull(message = "El sexo es obligatorio")
        Sexo sexo,

        @Size(max = 150)
        String tituloMaximo,

        @NotNull(message = "La fecha de nacimiento es obligatoria")
        @Past(message = "La fecha de nacimiento debe ser pasada")
        LocalDate fechaNacimiento,

        @NotBlank(message = "El departamento es obligatorio")
        String departamento,

        @NotBlank(message = "El municipio es obligatorio")
        String municipio,

        String domicilio,

        @NotEmpty(message = "Debe indicar al menos un cultivo")
        List<@NotNull Long> cultivoIds,

        @Valid
        List<FamiliarRequest> familiares
) {}
