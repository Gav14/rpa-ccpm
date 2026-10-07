package com.rpa.backend.repository;

import com.rpa.backend.model.Productor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductorRepository extends JpaRepository<Productor, Long>, JpaSpecificationExecutor<Productor> {

    Optional<Productor> findByDni(String dni);

    boolean existsByDni(String dni);

    @Query("SELECT p.departamento, COUNT(p) FROM Productor p GROUP BY p.departamento")
    List<Object[]> contarPorDepartamento();

    @Query("SELECT p.municipio, COUNT(p) FROM Productor p GROUP BY p.municipio")
    List<Object[]> contarPorMunicipio();

    @Query("SELECT p.sexo, COUNT(p) FROM Productor p GROUP BY p.sexo")
    List<Object[]> contarPorSexo();

    @Query("SELECT c.nombre, COUNT(p) FROM Productor p JOIN p.cultivos c GROUP BY c.nombre")
    List<Object[]> contarPorCultivo();
}
