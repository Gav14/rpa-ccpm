package com.rpa.backend.repository;

import com.rpa.backend.model.Familiar;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FamiliarRepository extends JpaRepository<Familiar, Long> {

    List<Familiar> findByProductorId(Long productorId);
}