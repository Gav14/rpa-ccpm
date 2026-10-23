package com.rpa.backend.repository;

import com.rpa.backend.model.Cultivo;
import com.rpa.backend.model.Productor;
import com.rpa.backend.model.Sexo;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public interface ProductorSpecification {
    public static Specification<Productor> conFiltros(
            String apellido, String nombre, String dni, Sexo sexo,
            String departamento, String municipio, String cultivo) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (apellido != null && !apellido.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("apellido")),
                        "%" + apellido.toLowerCase() + "%"));
            }
            if (nombre != null && !nombre.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("nombre")),
                        "%" + nombre.toLowerCase() + "%"));
            }
            if (dni != null && !dni.isBlank()) {
                predicates.add(cb.like(root.get("dni"), dni + "%"));
            }
            if (sexo != null) {
                predicates.add(cb.equal(root.get("sexo"), sexo));
            }
            if (departamento != null && !departamento.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("departamento")),
                        departamento.toLowerCase()));
            }
            if (municipio != null && !municipio.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("municipio")),
                        municipio.toLowerCase()));
            }
            if (cultivo != null && !cultivo.isBlank()) {
                Join<Productor, Cultivo> join = root.join("cultivos");
                predicates.add(cb.equal(cb.lower(join.get("nombre")),
                        cultivo.toLowerCase()));
                query.distinct(true);   // evita productores duplicados por el join
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
