CREATE TABLE productor (
    id               BIGSERIAL PRIMARY KEY,
    apellido         VARCHAR(100) NOT NULL,
    nombre           VARCHAR(100) NOT NULL,
    dni              VARCHAR(10)  NOT NULL UNIQUE,
    sexo             VARCHAR(20)  NOT NULL CHECK (sexo IN ('MASCULINO', 'FEMENINO', 'OTRO')),
    titulo_maximo    VARCHAR(150),
    fecha_nacimiento DATE         NOT NULL,
    departamento     VARCHAR(100) NOT NULL,
    municipio        VARCHAR(100) NOT NULL,
    domicilio        VARCHAR(200)
);

CREATE TABLE cultivo (
    id     BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE productor_cultivo (
    productor_id BIGINT NOT NULL REFERENCES productor(id) ON DELETE CASCADE,
    cultivo_id   BIGINT NOT NULL REFERENCES cultivo(id)   ON DELETE CASCADE,
    PRIMARY KEY (productor_id, cultivo_id)
);

CREATE TABLE familiar (
    id               BIGSERIAL PRIMARY KEY,
    productor_id     BIGINT       NOT NULL REFERENCES productor(id) ON DELETE CASCADE,
    apellido         VARCHAR(100) NOT NULL,
    nombre           VARCHAR(100) NOT NULL,
    sexo             VARCHAR(20)  NOT NULL CHECK (sexo IN ('MASCULINO', 'FEMENINO', 'OTRO')),
    dni              VARCHAR(10),
    fecha_nacimiento DATE,
    parentesco       VARCHAR(20)  NOT NULL CHECK (parentesco IN
        ('HIJO', 'HIJA', 'CONYUGE', 'PADRE', 'MADRE', 'TIO', 'TIA',
         'ABUELO', 'ABUELA', 'HERMANO', 'HERMANA', 'OTRO'))
);