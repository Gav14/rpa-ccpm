package com.rpa.backend.exception;

/**
 * Se lanza cuando se intenta eliminar un recurso que otros registros todavía usan
 * (por ejemplo, un cultivo asignado a uno o más productores). Se responde con 409.
 */
public class RecursoEnUsoException extends RuntimeException {
    public RecursoEnUsoException(String mensaje) {
        super(mensaje);
    }
}
