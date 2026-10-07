package com.rpa.backend.service.impl;

import com.rpa.backend.dto.FamiliarRequest;
import com.rpa.backend.dto.ProductorRequest;
import com.rpa.backend.dto.ProductorResponse;
import com.rpa.backend.exception.DniDuplicadoException;
import com.rpa.backend.exception.RecursoNoEncontradoException;
import com.rpa.backend.model.Cultivo;
import com.rpa.backend.model.Familiar;
import com.rpa.backend.model.Productor;
import com.rpa.backend.model.Sexo;
import com.rpa.backend.repository.CultivoRepository;
import com.rpa.backend.repository.ProductorRepository;
import com.rpa.backend.repository.ProductorSpecification;
import com.rpa.backend.service.ProductorService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProductorServiceImpl implements ProductorService {

    private final ProductorRepository productorRepository;
    private final CultivoRepository cultivoRepository;

    public ProductorServiceImpl(ProductorRepository productorRepository,
                                CultivoRepository cultivoRepository) {
        this.productorRepository = productorRepository;
        this.cultivoRepository = cultivoRepository;
    }

    @Transactional
    public ProductorResponse crear(ProductorRequest request) {
        if (productorRepository.existsByDni(request.dni())) {
            throw new DniDuplicadoException(request.dni());
        }

        Productor productor = new Productor();
        mapearDatosBasicos(request, productor);
        productor.setCultivos(cargarCultivos(request.cultivoIds()));

        if (request.familiares() != null) {
            for (FamiliarRequest fr : request.familiares()) {
                Familiar familiar = mapearFamiliar(fr);
                familiar.setProductor(productor);
                productor.getFamiliares().add(familiar);
            }
        }

        return aResponse(productorRepository.save(productor));
    }

    public ProductorResponse buscarPorId(Long id) {
        Productor productor = productorRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe un productor con id " + id));
        return aResponse(productor);
    }

    public List<ProductorResponse> buscar(String apellido, String nombre, String dni, Sexo sexo, String departamento, String municipio, String cultivo) {
        return productorRepository
                .findAll(ProductorSpecification.conFiltros(
                        apellido, nombre, dni, sexo, departamento, municipio, cultivo))
                .stream()
                .map(this::aResponse)
                .toList();
    }

    @Transactional
    public ProductorResponse actualizar(Long id, ProductorRequest request) {
        Productor productor = productorRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe un productor con id " + id));

        productorRepository.findByDni(request.dni()).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new DniDuplicadoException(request.dni());
            }
        });

        mapearDatosBasicos(request, productor);
        productor.setCultivos(cargarCultivos(request.cultivoIds()));

        productor.getFamiliares().clear();   // orphanRemoval borra los viejos
        if (request.familiares() != null) {
            for (FamiliarRequest fr : request.familiares()) {
                Familiar familiar = mapearFamiliar(fr);
                familiar.setProductor(productor);
                productor.getFamiliares().add(familiar);
            }
        }

        return aResponse(productorRepository.save(productor));
    }

    @Transactional
    public void eliminar(Long id) {
        Productor productor = productorRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "No existe un productor con id " + id));
        productorRepository.delete(productor);   // cascada borra familiares y vínculos
    }

    // ---- métodos privados de mapeo ----

    private void mapearDatosBasicos(ProductorRequest r, Productor p) {
        p.setApellido(r.apellido());
        p.setNombre(r.nombre());
        p.setDni(r.dni());
        p.setSexo(r.sexo());
        p.setTituloMaximo(r.tituloMaximo());
        p.setFechaNacimiento(r.fechaNacimiento());
        p.setDepartamento(r.departamento());
        p.setMunicipio(r.municipio());
        p.setDomicilio(r.domicilio());
    }

    private Familiar mapearFamiliar(FamiliarRequest fr) {
        Familiar f = new Familiar();
        f.setApellido(fr.apellido());
        f.setNombre(fr.nombre());
        f.setSexo(fr.sexo());
        f.setDni(fr.dni());
        f.setFechaNacimiento(fr.fechaNacimiento());
        f.setParentesco(fr.parentesco());
        return f;
    }

    private Set<Cultivo> cargarCultivos(List<Long> cultivoIds) {
        Set<Cultivo> cultivos = new HashSet<>();
        for (Long cultivoId : cultivoIds) {
            cultivos.add(cultivoRepository.findById(cultivoId)
                    .orElseThrow(() -> new RecursoNoEncontradoException(
                            "No existe un cultivo con id " + cultivoId)));
        }
        return cultivos;
    }

    private ProductorResponse aResponse(Productor p) {
        return new ProductorResponse(
                p.getId(), p.getApellido(), p.getNombre(), p.getDni(), p.getSexo(),
                p.getTituloMaximo(), p.getFechaNacimiento(), p.getDepartamento(),
                p.getMunicipio(), p.getDomicilio(),
                p.getCultivos().stream().map(Cultivo::getNombre).toList(),
                p.getFamiliares().stream().map(f -> new FamiliarRequest(
                        f.getApellido(), f.getNombre(), f.getSexo(), f.getDni(),
                        f.getFechaNacimiento(), f.getParentesco())).toList()
        );
    }
}