package com.rpa.backend.repository;

import com.rpa.backend.model.Cultivo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CultivoRepository extends JpaRepository<Cultivo, Long> {

    Optional<Cultivo> findByNombre(String nombre);
}
