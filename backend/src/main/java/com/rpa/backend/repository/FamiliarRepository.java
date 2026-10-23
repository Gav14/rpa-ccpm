package com.rpa.backend.repository;

import com.rpa.backend.model.Familiar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FamiliarRepository extends JpaRepository<Familiar, Long> {

    List<Familiar> findByProductorId(Long productorId);

    @Query("SELECT f.parentesco, COUNT(f) FROM Familiar f GROUP BY f.parentesco")
    List<Object[]> contarPorParentesco();


}