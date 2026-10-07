package com.rpa.backend.repository;

import com.rpa.backend.model.Productor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductorRepository extends JpaRepository<Productor, Long> {

    Optional<Productor> findByDni(String dni);

    boolean existsByDni(String dni);
}
