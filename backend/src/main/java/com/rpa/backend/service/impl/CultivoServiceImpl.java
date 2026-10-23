package com.rpa.backend.service.impl;

import com.rpa.backend.dto.CultivoRequest;
import com.rpa.backend.exception.RecursoDuplicadoException;
import com.rpa.backend.exception.RecursoEnUsoException;
import com.rpa.backend.exception.RecursoNoEncontradoException;
import com.rpa.backend.model.Cultivo;
import com.rpa.backend.repository.CultivoRepository;
import com.rpa.backend.repository.ProductorRepository;
import com.rpa.backend.service.CultivoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CultivoServiceImpl implements CultivoService {

    private final CultivoRepository cultivoRepository;
    private final ProductorRepository productorRepository;

    public CultivoServiceImpl(CultivoRepository cultivoRepository,
                              ProductorRepository productorRepository) {
        this.cultivoRepository = cultivoRepository;
        this.productorRepository = productorRepository;
    }

    public List<Cultivo> listar() {
        return cultivoRepository.findAll();
    }

    public Cultivo crear(CultivoRequest request) {
        // 1. Validar que no exista otro cultivo con el mismo nombre
        if (cultivoRepository.findByNombre(request.nombre()).isPresent()) {
            throw new RecursoDuplicadoException(
                "Ya existe un cultivo con el nombre: " + request.nombre());
        }

        // 2. Mapear DTO → entidad
        Cultivo cultivo = new Cultivo();
        cultivo.setNombre(request.nombre());

        // 3. Persistir
        return cultivoRepository.save(cultivo);
    }

    public void eliminar(Long id) {
        // Validar que exista antes de borrar (para dar 404 claro en vez de un delete silencioso)
        if (!cultivoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException(
                "Cultivo no encontrado con id: " + id);
        }
        // No se permite borrar un cultivo asignado a productores: dejaría productores
        // sin cultivos y violaría la regla "al menos un cultivo por productor".
        long productoresQueLoUsan = productorRepository.countByCultivosId(id);
        if (productoresQueLoUsan > 0) {
            throw new RecursoEnUsoException(
                "No se puede eliminar el cultivo porque está asignado a "
                + productoresQueLoUsan + " productor(es). Quitalo de esos productores primero.");
        }

        cultivoRepository.deleteById(id);
    }
}