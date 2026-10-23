package com.rpa.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "productor")
public class Productor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 10)
    private String dni;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Sexo sexo;

    @Column(name = "titulo_maximo", length = 150)
    private String tituloMaximo;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(nullable = false, length = 100)
    private String departamento;

    @Column(nullable = false, length = 100)
    private String municipio;

    @Column(length = 200)
    private String domicilio;

    @OneToMany(mappedBy = "productor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Familiar> familiares = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "productor_cultivo",
            joinColumns = @JoinColumn(name = "productor_id"),
            inverseJoinColumns = @JoinColumn(name = "cultivo_id")
    )
    private Set<Cultivo> cultivos = new HashSet<>();
}
