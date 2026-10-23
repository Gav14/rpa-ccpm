package com.rpa.backend.dto;

import com.rpa.backend.model.Parentesco;
import com.rpa.backend.model.Sexo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record FamiliarRequest(
        @NotBlank(message = "El apellido es obligatorio")
        @Size(max = 100)
        String apellido,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100)
        String nombre,

        @NotNull(message = "El sexo es obligatorio")
        Sexo sexo,

        @Size(max = 10)
        String dni,

        @Past(message = "La fecha de nacimiento debe ser pasada")
        LocalDate fechaNacimiento,

        @NotNull(message = "El parentesco es obligatorio")
        Parentesco parentesco
) {}