-- Generado por Oracle SQL Developer Data Modeler 22.2.0.165.1149
--   en:        2022-10-19 08:58:30 CST
--   sitio:      SQL Server 2008
--   tipo:      SQL Server 2008


CREATE TABLE area 
    (
     codigo NVARCHAR (3) NOT NULL , 
     nombre NVARCHAR (30) NOT NULL , 
     descripcion NVARCHAR (100) 
    )
GO

ALTER TABLE area ADD CONSTRAINT area_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE cliente 
    (
     codigo INTEGER NOT NULL , 
     nombre NVARCHAR (30) NOT NULL , 
     NombreC NVARCHAR (30) NOT NULL , 
     NIT NVARCHAR (15) NOT NULL , 
     direccion NVARCHAR (100) NOT NULL , 
     telefonoCelular INTEGER NOT NULL , 
     telefonoCasa INTEGER NOT NULL , 
     tipoCliente NVARCHAR (2) NOT NULL , 
     DPI NVARCHAR (15) NOT NULL , 
     NoPasaporte NVARCHAR (15) , 
     paisOrigen INTEGER , 
     profesion NVARCHAR (30) , 
     cedula NVARCHAR (15) , 
     estadoCivil NVARCHAR (10) , 
     extendidaEn NVARCHAR (30) , 
     pais_codigo INTEGER NOT NULL 
    )
GO

ALTER TABLE cliente ADD CONSTRAINT cliente_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE departamento 
    (
     codigo INTEGER NOT NULL , 
     nombre NVARCHAR (30) NOT NULL , 
     descripcion NCHAR (50) , 
     pais INTEGER NOT NULL , 
     pais_codigo INTEGER NOT NULL 
    )
GO

ALTER TABLE departamento ADD CONSTRAINT departamento_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Detalle_de_Recibo 
    (
     TiTran NVARCHAR (2) NOT NULL , 
     Serie NVARCHAR (2) NOT NULL , 
     docu INTEGER NOT NULL , 
     abono FLOAT NOT NULL , 
     TiTranFac NVARCHAR (2) NOT NULL , 
     SerieFac NVARCHAR (2) NOT NULL , 
     factura INTEGER NOT NULL , 
     TiTran1 NVARCHAR NOT NULL , 
     Serie1 NVARCHAR NOT NULL , 
     docu1 INTEGER NOT NULL , 
     TiTran2 NVARCHAR NOT NULL , 
     Serie2 NVARCHAR NOT NULL , 
     docu2 INTEGER NOT NULL 
    )
GO

ALTER TABLE Detalle_de_Recibo ADD CONSTRAINT Detalle_de_Recibo_PK PRIMARY KEY CLUSTERED (TiTran, Serie, docu)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Detalle_de_Transaccion 
    (
     titran NVARCHAR (2) NOT NULL , 
     serie NVARCHAR (2) NOT NULL , 
     docu INTEGER NOT NULL , 
     servicio NVARCHAR (2) NOT NULL , 
     area NVARCHAR (2) NOT NULL , 
     cantidad INTEGER NOT NULL , 
     precio FLOAT NOT NULL , 
     habitacion INTEGER , 
     habitacion_codigo NVARCHAR (4) NOT NULL , 
     Encabezado_de_Transacciones_TiTran NVARCHAR (2) NOT NULL , 
     TiTran2 NVARCHAR NOT NULL , 
     Encabezado_de_Transacciones_Serie NVARCHAR (2) NOT NULL , 
     Serie2 NVARCHAR NOT NULL , 
     Encabezado_de_Transacciones_docu INTEGER NOT NULL , 
     docu2 INTEGER NOT NULL 
    )
GO 

    


CREATE UNIQUE NONCLUSTERED INDEX 
    Detalle_de_Transaccion__IDX ON Detalle_de_Transaccion 
    ( 
     habitacion_codigo 
    ) 
GO

ALTER TABLE Detalle_de_Transaccion ADD CONSTRAINT Detalle_de_Transaccion_PK PRIMARY KEY CLUSTERED (titran, serie, docu)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Encabezado_de_Recibo 
    (
     TiTran NVARCHAR (2) NOT NULL , 
     Serie NVARCHAR (2) NOT NULL , 
     docu INTEGER NOT NULL , 
     cliente INTEGER NOT NULL , 
     fecha DATETIME NOT NULL , 
     Total FLOAT , 
     referencia NVARCHAR (30) , 
     Descripcion NVARCHAR (100) , 
     vendedor NVARCHAR (2) , 
     vendedor_codigo NVARCHAR (2) NOT NULL , 
     cliente_codigo INTEGER NOT NULL , 
     Tipo_Transaccion_codigo NVARCHAR (2) NOT NULL 
    )
GO

ALTER TABLE Encabezado_de_Recibo ADD CONSTRAINT Encabezado_de_Recibo_PK PRIMARY KEY CLUSTERED (Serie, TiTran, docu)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Encabezado_de_Transacciones 
    (
     TiTran NVARCHAR (2) NOT NULL , 
     Serie NVARCHAR (2) NOT NULL , 
     docu INTEGER NOT NULL , 
     habitacion INTEGER NOT NULL , 
     fecha DATETIME NOT NULL , 
     cliente INTEGER NOT NULL , 
     referencia NTEXT , 
     vendedor NVARCHAR (3) NOT NULL , 
     FechaIngreso DATETIME , 
     FechaSalida DATETIME , 
     SubTotal FLOAT NOT NULL , 
     Total FLOAT NOT NULL , 
     Saldo FLOAT NOT NULL , 
     NumeroPersonas INTEGER , 
     estado INTEGER , 
     Tipo_Transaccion_codigo NVARCHAR (2) NOT NULL , 
     cliente_codigo INTEGER NOT NULL , 
     vendedor_codigo NVARCHAR (2) NOT NULL 
    )
GO

ALTER TABLE Encabezado_de_Transacciones ADD CONSTRAINT Encabezado_de_Transacciones_PK PRIMARY KEY CLUSTERED (TiTran, Serie, docu)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE funcion 
    (
     codigo NVARCHAR (2) NOT NULL , 
     nombre NVARCHAR (30) NOT NULL , 
     descripcion NVARCHAR (100) , 
     tipofuncion NVARCHAR (2) NOT NULL , 
     codigo1 NVARCHAR NOT NULL , 
     tipofuncion1 NVARCHAR NOT NULL 
    )
GO

ALTER TABLE funcion ADD CONSTRAINT funcion_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE funcionalidad 
    (
     pagina NVARCHAR (3) NOT NULL , 
     funcion NVARCHAR (2) NOT NULL , 
     tipoFuncion NVARCHAR (2) NOT NULL , 
     estado INTEGER NOT NULL , 
     funcion_codigo NVARCHAR (2) NOT NULL , 
     pagina_codigo NVARCHAR (3) NOT NULL 
    )
GO

ALTER TABLE funcionalidad ADD CONSTRAINT funcionalidad_PK PRIMARY KEY CLUSTERED (funcion)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE habitacion 
    (
     codigo NVARCHAR (4) NOT NULL , 
     nombre NVARCHAR (30) NOT NULL , 
     descripcion NVARCHAR (100) NOT NULL , 
     area UNKNOWN 
--  ERROR: Datatype UNKNOWN is not allowed 
                    NOT NULL , 
     area1 UNKNOWN 
--  ERROR: Datatype UNKNOWN is not allowed 
                    NOT NULL , 
     codigo1 NVARCHAR NOT NULL , 
     nivel NUMERIC (28) NOT NULL , 
     estado INTEGER NOT NULL 
    )
GO

ALTER TABLE habitacion ADD CONSTRAINT habitacion_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE pagina 
    (
     codigo NVARCHAR (3) NOT NULL , 
     nombre NVARCHAR (30) NOT NULL , 
     descripcion NVARCHAR (100) NOT NULL , 
     modulo NVARCHAR (30) NOT NULL , 
     objeto NVARCHAR (30) , 
     indice INTEGER , 
     forma NVARCHAR (10) 
    )
GO

ALTER TABLE pagina ADD CONSTRAINT pagina_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE pais 
    (
     codigo INTEGER NOT NULL , 
     nombre NVARCHAR (50) NOT NULL , 
     ISO2 UNKNOWN 
--  ERROR: Datatype UNKNOWN is not allowed 
                    , 
     descripcion NVARCHAR (100) 
    )
GO 



EXEC sp_addextendedproperty 'MS_Description' , 'Nombre corto de referencia Guatemala gt' , 'USER' , 'dbo' , 'TABLE' , 'pais' , 'COLUMN' , 'ISO2' 
GO

ALTER TABLE pais ADD CONSTRAINT pais_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE perfil 
    (
     codigo NVARCHAR (2) NOT NULL , 
     nombre NVARCHAR (30) NOT NULL , 
     descripcion NVARCHAR (100) 
    )
GO

ALTER TABLE perfil ADD CONSTRAINT perfil_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE permiso 
    (
     perfil NVARCHAR (2) NOT NULL , 
     pagina NVARCHAR (3) NOT NULL , 
     funcion NVARCHAR (2) NOT NULL , 
     tipoFuncion NVARCHAR (2) NOT NULL , 
     Activo BIT NOT NULL , 
     funcionalidad_funcion NVARCHAR (2) NOT NULL , 
     perfil_codigo NVARCHAR (2) NOT NULL 
    )
GO

ALTER TABLE permiso ADD CONSTRAINT permiso_PK PRIMARY KEY CLUSTERED (perfil, tipoFuncion, funcion, pagina)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE servicio 
    (
     codigo NVARCHAR (2) NOT NULL , 
     nombre NVARCHAR (30) NOT NULL , 
     descripcion NVARCHAR (100) , 
     precioUnitario FLOAT NOT NULL , 
     PrecioMayorista FLOAT NOT NULL 
    )
GO

ALTER TABLE servicio ADD CONSTRAINT servicio_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE Tipo_Transaccion 
    (
     codigo NVARCHAR (2) NOT NULL , 
     nombre NVARCHAR (50) , 
     Descripcion NVARCHAR (100) 
    )
GO

ALTER TABLE Tipo_Transaccion ADD CONSTRAINT Tipo_Transaccion_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE tipoFuncion 
    (
     codigo NVARCHAR (2) NOT NULL , 
     nombre NVARCHAR (30) NOT NULL , 
     descripcion NVARCHAR (50) 
    )
GO

ALTER TABLE tipoFuncion ADD CONSTRAINT tipoFuncion_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE usuario 
    (
     codigo NVARCHAR (3) NOT NULL , 
     nombre NVARCHAR (4) NOT NULL , 
     perfil_codigo NVARCHAR (2) NOT NULL 
    )
GO

ALTER TABLE usuario ADD CONSTRAINT usuario_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

CREATE TABLE vendedor 
    (
     codigo NVARCHAR (2) NOT NULL , 
     nombre NVARCHAR (30) NOT NULL , 
     descripcion NVARCHAR (50) NOT NULL , 
     comisionVenta FLOAT NOT NULL 
    )
GO

ALTER TABLE vendedor ADD CONSTRAINT vendedor_PK PRIMARY KEY CLUSTERED (codigo)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON )
GO

ALTER TABLE cliente 
    ADD CONSTRAINT cliente_pais_FK FOREIGN KEY 
    ( 
     pais_codigo
    ) 
    REFERENCES pais 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE departamento 
    ADD CONSTRAINT departamento_pais_FK FOREIGN KEY 
    ( 
     pais_codigo
    ) 
    REFERENCES pais 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Detalle_de_Recibo 
    ADD CONSTRAINT Detalle_de_Recibo_Encabezado_de_Recibo_FK FOREIGN KEY 
    REFERENCES Encabezado_de_Recibo 
    ( 
     Serie , 
     TiTran , 
     docu 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Detalle_de_Recibo 
    ADD CONSTRAINT Detalle_de_Recibo_Encabezado_de_Transacciones_FK FOREIGN KEY 
    REFERENCES Encabezado_de_Transacciones 
    ( 
     TiTran , 
     Serie , 
     docu 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Detalle_de_Transaccion 
    ADD CONSTRAINT Detalle_de_Transaccion_Encabezado_de_Transacciones_FK FOREIGN KEY 
    ( 
     Encabezado_de_Transacciones_TiTran, 
     Encabezado_de_Transacciones_Serie, 
     Encabezado_de_Transacciones_docu
    ) 
    REFERENCES Encabezado_de_Transacciones 
    ( 
     TiTran , 
     Serie , 
     docu 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Detalle_de_Transaccion 
    ADD CONSTRAINT Detalle_de_Transaccion_habitacion_FK FOREIGN KEY 
    ( 
     habitacion_codigo
    ) 
    REFERENCES habitacion 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Detalle_de_Transaccion 
    ADD CONSTRAINT Detalle_de_Transaccion_servicio_FK FOREIGN KEY 
    REFERENCES servicio 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Encabezado_de_Recibo 
    ADD CONSTRAINT Encabezado_de_Recibo_cliente_FK FOREIGN KEY 
    ( 
     cliente_codigo
    ) 
    REFERENCES cliente 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Encabezado_de_Recibo 
    ADD CONSTRAINT Encabezado_de_Recibo_Tipo_Transaccion_FK FOREIGN KEY 
    ( 
     Tipo_Transaccion_codigo
    ) 
    REFERENCES Tipo_Transaccion 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Encabezado_de_Recibo 
    ADD CONSTRAINT Encabezado_de_Recibo_vendedor_FK FOREIGN KEY 
    ( 
     vendedor_codigo
    ) 
    REFERENCES vendedor 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Encabezado_de_Transacciones 
    ADD CONSTRAINT Encabezado_de_Transacciones_cliente_FK FOREIGN KEY 
    ( 
     cliente_codigo
    ) 
    REFERENCES cliente 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Encabezado_de_Transacciones 
    ADD CONSTRAINT Encabezado_de_Transacciones_Tipo_Transaccion_FK FOREIGN KEY 
    ( 
     Tipo_Transaccion_codigo
    ) 
    REFERENCES Tipo_Transaccion 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE Encabezado_de_Transacciones 
    ADD CONSTRAINT Encabezado_de_Transacciones_vendedor_FK FOREIGN KEY 
    ( 
     vendedor_codigo
    ) 
    REFERENCES vendedor 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE funcion 
    ADD CONSTRAINT funcion_tipoFuncion_FK FOREIGN KEY 
    REFERENCES tipoFuncion 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE funcionalidad 
    ADD CONSTRAINT funcionalidad_funcion_FK FOREIGN KEY 
    ( 
     funcion_codigo
    ) 
    REFERENCES funcion 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE funcionalidad 
    ADD CONSTRAINT funcionalidad_pagina_FK FOREIGN KEY 
    ( 
     pagina_codigo
    ) 
    REFERENCES pagina 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE habitacion 
    ADD CONSTRAINT habitacion_area_FK FOREIGN KEY 
    REFERENCES area 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE permiso 
    ADD CONSTRAINT permiso_funcionalidad_FK FOREIGN KEY 
    ( 
     funcionalidad_funcion
    ) 
    REFERENCES funcionalidad 
    ( 
     funcion 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE permiso 
    ADD CONSTRAINT permiso_perfil_FK FOREIGN KEY 
    ( 
     perfil_codigo
    ) 
    REFERENCES perfil 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO

ALTER TABLE usuario 
    ADD CONSTRAINT usuario_perfil_FK FOREIGN KEY 
    ( 
     perfil_codigo
    ) 
    REFERENCES perfil 
    ( 
     codigo 
    ) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION 
GO



-- Informe de Resumen de Oracle SQL Developer Data Modeler: 
-- 
-- CREATE TABLE                            19
-- CREATE INDEX                             1
-- ALTER TABLE                             39
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
-- ALTER TRIGGER                            0
-- CREATE DATABASE                          0
-- CREATE DEFAULT                           0
-- CREATE INDEX ON VIEW                     0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE ROLE                              0
-- CREATE RULE                              0
-- CREATE SCHEMA                            0
-- CREATE PARTITION FUNCTION                0
-- CREATE PARTITION SCHEME                  0
-- 
-- DROP DATABASE                            0
-- 
-- ERRORS                                   3
-- WARNINGS                                 0
