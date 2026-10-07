package com.rpa.backend.exception;

public class DniDuplicadoException extends RuntimeException {
    public DniDuplicadoException(String dni) {
        super("Ya existe un productor con DNI " + dni);
    }
}