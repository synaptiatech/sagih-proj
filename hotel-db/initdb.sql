--
-- -----------------------------------------------------
-- CLEAN DATABASE
-- -----------------------------------------------------
--
-- -----------------------------------------------------
-- Drop triggers
-- -----------------------------------------------------
drop trigger if exists trg_add_profile
	on perfil;
drop function if exists trgfn_add_profile();
drop trigger if exists trg_add_page
	on pagina;
drop function if exists trgfn_add_page();
drop trigger if exists trg_add_tranenc
	on encabezado_transaccion;
drop function if exists trgfn_add_tranenc();
drop trigger if exists trg_upd_tranenc
	on encabezado_transaccion;
drop function if exists trgfn_upd_tranenc();
	on detalle_transaccion;
drop trigger if exists trg_add_trandet
drop function if exists trgfn_add_trandet();
drop trigger if exists trg_upd_trandet
	on detalle_transaccion;
drop function if exists trgfn_upd_trandet();
drop trigger if exists trg_add_rcenc
	on encabezado_recibo;
drop function if exists trgfn_add_rcenc();
drop trigger if exists trg_add_rcdet
	on detalle_recibo;
drop function if exists trgfn_add_rcdet();
-- -----------------------------------------------------
-- Drop Functions
-- -----------------------------------------------------
drop function if exists trgfn_update_tranenc();
drop function if exists tranEncByHabitacion(int4, varchar);
drop function if exists fn_permisos_pagina (varchar(50), int, int);
drop function if exists fn_tranenc_hab (int, varchar(3));
drop function if exists fn_tranenc_hab(integer,character varying,integer);
-- -----------------------------------------------------
-- Drop vistas
-- -----------------------------------------------------
drop view if exists v_cliente;
drop view if exists v_habitacion;
drop view if exists v_pp_tranenc ;
drop view if exists v_rc_detalle;
drop view if exists v_rc_encabezado;
drop view if exists v_reporte_servicio;
drop view if exists v_reporte_transaccion;
drop view if exists v_servicio;
drop view if exists v_tran_detalle;
drop view if exists v_transaccion;
-- -----------------------------------------------------
-- Drop tables
-- -----------------------------------------------------
drop table if exists empresa;
drop table if exists cierre;
drop table if exists impuestos;
drop table if exists permiso;
drop table if exists usuario;
drop table if exists perfil;
drop table if exists funcion;
drop table if exists tipo_funcion;
drop table if exists pagina;
drop table if exists detalle_transaccion;
drop table if exists detalle_recibo;
drop table if exists tipo_pago;
drop table if exists pp_tranenc;
drop table if exists encabezado_recibo;
drop table if exists encabezado_transaccion;
drop table if exists vendedor;
drop table if exists cliente;
drop table if exists departamento;
drop table if exists pais;
drop table if exists correlativo;
drop table if exists tipo_transaccion;
drop table if exists producto;
drop table if exists servicio;
drop table if exists tipo_servicio;
drop table if exists habitacion;
drop table if exists tipo_habitacion;
drop table if exists nivel;
drop table if exists area;
drop table if exists empresa;
--
-- -----------------------------------------------------
-- CREATE TABLES
-- -----------------------------------------------------
--
-- -----------------------------------------------------
-- Table area
-- -----------------------------------------------------
create table if not exists area (
  codigo int generated always as identity,
  nombre varchar(30) not null,
  descripcion varchar(100) null,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table nivel
-- -----------------------------------------------------
create table if not exists nivel (
  codigo int generated always as identity,
  nombre varchar(30) not null,
  descripcion varchar(100) null,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table tipo_habitacion
-- -----------------------------------------------------
create table if not exists tipo_habitacion (
  codigo int generated always as identity,
  nombre varchar(45) not null,
  descripcion varchar(100) not null,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table habitacion
-- ----------------------------------------------------- D disponible | L limpieza | O ocupado
create table if not exists habitacion (
  codigo int generated always as identity,
  area int not null,
  nombre varchar(30) not null unique ,
  descripcion varchar(100) not null,
  precio numeric(12, 2) not null,
  nivel int not null,
  estado char(1) default 'L',
  tipo int not null,
  primary key (codigo),
  constraint fk_habitacion_area foreign key (area) references area (codigo) on
  delete restrict on
  update cascade,
    constraint fk_habitacion_nivel foreign key (nivel) references nivel (codigo) on
  delete restrict on
  update cascade,
    constraint fk_habitacion_tipo_habitacion foreign key (tipo) references tipo_habitacion (codigo) on
  delete restrict on
  update cascade
);
-- -----------------------------------------------------
-- Table tipo_servicio
-- -----------------------------------------------------
create table if not exists tipo_servicio (
  codigo int generated always as identity,
  nombre varchar(45) null,
  descripcion varchar(45) null,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table servicio
-- -----------------------------------------------------
create table if not exists servicio (
  codigo int generated always as identity,
  nombre varchar(30) not null,
  descripcion varchar(100) null,
  precio_unitario numeric(12, 2) not null,
  precio_mayorista numeric(12, 2) not null,
  tipo int not null,
  primary key (codigo),
  constraint fk_servicio_tipo_servicio foreign key (tipo) references tipo_servicio (codigo) on
  delete restrict on
  update cascade
);
-- -----------------------------------------------------
-- Table producto
-- -----------------------------------------------------
create table if not exists proveedor (
  codigo int generated always as identity,
  nombre varchar(30) ,
  direccion varchar(100) ,
  telefono varchar(100) ,
  nit varchar(10) ,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table tipo_transaccion
-- -----------------------------------------------------
create table if not exists tipo_transaccion (
  codigo varchar(3),
  nombre varchar(50) null,
  descripcion varchar(100) null,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table correlativo
-- -----------------------------------------------------
create table if not exists correlativo (
  serie varchar(5),
  tipo_transaccion varchar(2) not null,
  siguiente numeric null,
  primary key (serie, tipo_transaccion),
  constraint fk_correlativo_tipo_trans foreign key (tipo_transaccion) references tipo_transaccion (codigo) on
  delete restrict on
  update cascade
);
-- -----------------------------------------------------
-- Table pais
-- -----------------------------------------------------
create table if not exists pais (
  codigo int generated always as identity,
  nombre varchar(50) not null,
  iso2 varchar(10) null,
  descripcion varchar(100) null,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table departamento
-- -----------------------------------------------------
create table if not exists departamento (
  codigo int generated always as identity,
  nombre varchar(30) not null,
  descripcion nchar(50) null,
  pais int not null,
  primary key (codigo),
  constraint fk_departamento_pais foreign key (pais) references pais (codigo) on
  delete restrict on
  update cascade
);
-- -----------------------------------------------------
-- Table cliente
-- -----------------------------------------------------
create table if not exists cliente (
  codigo int generated always as identity,
  nombre varchar(30) not null,
  nombre_c varchar(30) default '',
  nombre_factura varchar(30) default '',
  nit varchar(15) not null,
  nit_factura varchar(15) default '',
  direccion varchar(100) not null,
  direccion_factura varchar(100) not null,
  telefono_celular int not null,
  telefono_casa int not null,
  tipo_cliente varchar(2) not null default '',
  dpi varchar(15) ,
  no_pasaporte varchar(15) ,
  profesion varchar(30) ,
  cedula varchar(15) ,
  estado_civil varchar(10) ,
  pais_origen int not null,
  extendido_en int ,
  saldo numeric(12, 2) default 0,
  primary key (codigo),
  constraint fk_cliente_pais1 foreign key (pais_origen) references pais (codigo) on
  delete restrict on
  update cascade,
    constraint fk_cliente_departamento foreign key (extendido_en) references departamento (codigo) on
  delete restrict on
  update cascade
);
-- -----------------------------------------------------
-- Table vendedor
-- -----------------------------------------------------
create table if not exists vendedor (
  codigo int generated always as identity,
  nombre varchar(45) null,
  descripcion varchar(45) null,
  comision_venta numeric(5,2) null,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table encabezado_transaccion
-- -----------------------------------------------------
create table if not exists encabezado_transaccion (
  serie varchar(5) not null,
  tipo_transaccion varchar(2) not null,
  documento numeric not null,
  fecha timestamp not null default now(),
  referencia text null,
  fecha_ingreso timestamp not null,
  fecha_salida timestamp not null,
  subtotal numeric(12, 2) null,
  total numeric(12, 2) null,
  saldo numeric(12, 2) null,
  numero_personas int not null,
  estado int null default 0,
  nombre_factura varchar(30) not null,
  nit_factura varchar(15) not null,
  direccion_factura varchar(100) not null,
  cliente int not null,
  vendedor int not null,
  iva numeric(5, 2) not null default 12,
  inguat numeric(5, 2) not null default 10,
  tipo_cambio numeric(5, 2) not null default 1,
  primary key (serie, tipo_transaccion, documento),
  constraint fk_encabezado_transaccion_serie foreign key (serie, tipo_transaccion) references correlativo (serie, tipo_transaccion) on
  delete restrict on
  update cascade,
    constraint fk_encabezado_transaccion_cliente foreign key (cliente) references cliente (codigo) on
  delete restrict on
  update cascade,
    constraint fk_encabezado_transaccion_vendedor foreign key (vendedor) references vendedor (codigo) on
  delete restrict on
  update cascade
);
-- -----------------------------------------------------
-- Table encabezado_recibo
-- -----------------------------------------------------
create table if not exists encabezado_recibo (
  serie varchar(5) not null,
  tipo_transaccion varchar(2) not null,
  documento numeric not null,
  cliente int not null,
  cobrador int null,
  fecha timestamp not null default now(),
  abono numeric(12, 2) null,
  referencia varchar(30) null,
  descripcion varchar(100) null,
  primary key (serie, tipo_transaccion, documento),
  constraint fk_encabezado_transaccion_serie foreign key (serie, tipo_transaccion) references correlativo (serie, tipo_transaccion) on
  delete restrict on
  update cascade,
    constraint fk_encabezado_recibo_cliente foreign key (cliente) references cliente (codigo) on
  delete restrict on
  update cascade,
    constraint fk_encabezado_recibo_vendedor foreign key (cobrador) references vendedor (codigo) on
  delete restrict on
  update cascade
);
-- -----------------------------------------------------
-- Table encabezado transaccion por pagar
-- -----------------------------------------------------
create table if not exists pp_tranenc (
  codigo int generated always as identity,
  serie varchar(5) not null,
  tipo_transaccion varchar(2) not null,
  documento numeric not null,
  fecha timestamp not null default now(),
  descripcion varchar(128) null,
  proveedor int null,
  total numeric(12, 2) null,
  iva numeric(12, 2) not null,
  primary key (codigo),
  constraint fk_pp_tranenc_proveedor 
	  foreign key (proveedor) 
	  references proveedor(codigo) 
	  on delete restrict on update cascade
);
-- -----------------------------------------------------
-- Table detalle_transaccion
-- -----------------------------------------------------
create table if not exists detalle_transaccion (
  codigo int generated always as identity,
  serie varchar(5) not null,
  tipo_transaccion varchar(2) not null,
  documento numeric not null,
  descripcion varchar(100) not null default '',
  habitacion int not null,
  servicio int not null,
  precio numeric(12, 2) not null,
  cantidad int not null,
  subtotal numeric(12, 2) not null,
  fecha timestamp default now(),
  primary key (codigo),
  constraint fk_detalle_transaccion_encabezado_trans 
	  foreign key (serie, tipo_transaccion, documento) 
	  references encabezado_transaccion (serie, tipo_transaccion, documento) 
	  on delete restrict 
	  on update cascade,
  constraint fk_detalle_transaccion_habitacion 
	  foreign key (habitacion) 
	  references habitacion (codigo) 
	  on delete restrict 
	  on update cascade,
  constraint fk_detalle_transaccion_servicio 
	  foreign key (servicio) 
	  references servicio (codigo) 
	  on delete restrict 
	  on update cascade
);
-- -----------------------------------------------------
-- Table tipo_pago
-- -----------------------------------------------------
create table if not exists tipo_pago (
  codigo int generated always as identity,
  nombre varchar(45) not null,
  descripcion varchar(45) null,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table detalle_recibo
-- -----------------------------------------------------
create table if not exists detalle_recibo (
  codigo int generated always as identity,
  serie varchar(5) not null,
  tipo_transaccion varchar(2) not null,
  documento numeric not null,
  serie_fac varchar(5) not null,
  ti_tran_fac varchar(2) not null,
  documento_fac numeric not null,
  fecha timestamp not null default now(),
  descripcion varchar(100) not null default '',
  tipo_pago int not null,
  monto numeric(12, 2) not null,
  primary key (codigo),
  constraint fk_detalle_recibo_tran_det foreign key (serie, tipo_transaccion, documento) references encabezado_recibo (serie, tipo_transaccion, documento) on
  delete restrict on
  update cascade,
    constraint fk_detalle_recibo_tran_enc foreign key (serie_fac, ti_tran_fac, documento_fac) references encabezado_transaccion (serie, tipo_transaccion, documento) on
  delete restrict on
  update cascade,
    constraint fk_detalle_recibo_tipo_pago foreign key (tipo_pago) references tipo_pago (codigo) on
  delete restrict on
  update cascade
);
-- -----------------------------------------------------
-- Table pagina
-- -----------------------------------------------------
create table if not exists pagina (
  codigo int generated always as identity,
  nombre varchar(50) not null,
  descripcion varchar(100) null,
  modulo varchar(50) not null,
  menu varchar(50) not null,
  indice int null,
  forma varchar(50) not null,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table tipo_funcion
-- -----------------------------------------------------
create table if not exists tipo_funcion (
  codigo int generated always as identity,
  nombre varchar(30) not null,
  descripcion varchar(50) null,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table funcion
-- -----------------------------------------------------
create table if not exists funcion (
  codigo int generated always as identity,
  tipo_funcion int not null,
  nombre varchar(30) null,
  descripcion varchar(100) null,
  primary key (codigo),
  constraint fk_funcion_tipo_funcion1 foreign key (tipo_funcion) references tipo_funcion (codigo) on
  delete restrict on
  update cascade
);
-- -----------------------------------------------------
-- Table perfil
-- -----------------------------------------------------
create table if not exists perfil (
  codigo int generated always as identity,
  nombre varchar(30) not null,
  descripcion varchar(100) null,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table usuario
-- -----------------------------------------------------
create table if not exists usuario (
  codigo int generated always as identity,
  perfil int not null,
  usuario varchar(45) unique not null,
  password varchar(256) not null,
  correo varchar(45) unique not null,
  primary key (codigo),
  constraint fk_usuario_perfil foreign key (perfil) references perfil (codigo) on
  delete restrict on
  update cascade
);
-- -----------------------------------------------------
-- Table funcionalidad
-- -----------------------------------------------------
create table if not exists permiso (
  funcion int not null,
  pagina int not null,
  perfil int not null,
  estado int not null,
  primary key (funcion, pagina, perfil),
  constraint fk_permiso_funcion foreign key (funcion) references funcion (codigo) on
  delete restrict on
  update cascade,
    constraint fk_permiso_pagina foreign key (pagina) references pagina (codigo) on
  delete restrict on
  update cascade,
    constraint fk_permiso_perfil foreign key (perfil) references perfil (codigo) on
  delete restrict on
  update cascade
);
-- -----------------------------------------------------
-- Table impuestos
-- -----------------------------------------------------
create table if not exists impuestos (
  codigo int generated always as identity,
  nombre varchar(45) not null,
  porcentaje numeric(5, 3) not null,
  primary key (codigo)
);
-- -----------------------------------------------------
-- Table cierre
-- -----------------------------------------------------
create table if not exists cierre (
  codigo int generated always as identity,
  usuario int not null,
  fecha_cierre timestamp not null,
  fecha_real timestamp not null default now(),
  total_efectivo numeric(12, 2) ,
  total_efectivo_dolar numeric(12, 2) ,
  total_cheque numeric(12, 2) ,
  total_transferencia numeric(12, 2) ,
  total_tarjeta numeric(12, 2) ,
  total_liquido numeric(12, 2) ,
  liquido_fisico numeric(12, 2) ,
  descripcion varchar(128) ,
  diferencia numeric(12, 2) ,
  primary key (codigo),
  constraint fk_cierre_usuario foreign key (usuario) references usuario (codigo) on
  delete restrict on
  update cascade
);
-- -----------------------------------------------------
-- Tabla empresa
-- -----------------------------------------------------
create table if not exists empresa (
  codigo int generated always as identity,
  nombre varchar(50) not null,
  direccion varchar(256) not null,
  nit varchar(17) not null,
  telefono varchar(8) not null,
  fecha_creacion timestamp not null default now(),
  correo varchar(100) not null,
  logo varchar(100), 
  primary key (codigo)
);
-- 
-- -----------------------------------------------------
-- Triggers
-- -----------------------------------------------------
-- 
-- -----------------------------------------------------
-- Trigger nuevo perfil
-- -----------------------------------------------------
create or replace function trgfn_add_profile()
returns trigger language plpgsql as $$
declare 
	rec_func record;
	rec_pag record;
begin 
	-- INICIALIZAR PERMISOS
	for rec_pag in 
		select codigo from pagina 
	loop 
		for rec_func in 
			select codigo from funcion 
			loop 
				insert into permiso (funcion, pagina, perfil, estado)
				values (rec_func.codigo, rec_pag.codigo, new.codigo, 0);
			end loop;
	end loop;
	return new;
end;
$$;	
-- -----------------------------------------------------
create trigger trg_add_profile
	after insert on perfil 
	for each row 
		execute procedure trgfn_add_profile();
-- -----------------------------------------------------
-- Trigger nueva pagina
-- -----------------------------------------------------
create or replace function trgfn_add_page()
returns trigger language plpgsql as $$
declare 
	rec_perfil record;
	rec_func record;
begin 
	-- INICIALIZAR PERMISOS
	for rec_perfil in 
		select codigo from perfil  
	loop 
		for rec_func in 
			select codigo from funcion 
			loop 
				insert into permiso (funcion, pagina, perfil, estado)
				values (rec_func.codigo, new.codigo, rec_perfil.codigo, 0);
			end loop;
	end loop;
	return new;
end;
$$;	
-- -----------------------------------------------------
create trigger trg_add_page
	after insert on pagina 
	for each row 
		execute procedure trgfn_add_page();
-- -----------------------------------------------------
-- Trigger insert encabezado_transaccion
-- -----------------------------------------------------
create or replace function trgfn_add_tranenc()
returns trigger language plpgsql as $$
declare 
	v_iva numeric(5,2);
	v_inguat numeric(5,2);
begin 
	v_iva = 12;
	v_inguat = 10;
	-- OBTENER IMPUESTOS
	select porcentaje into v_iva 
	from impuestos where nombre ilike 'iva';

	select porcentaje into v_inguat
	from impuestos where nombre ilike 'inguat';

	update encabezado_transaccion 
	set 
		subtotal = 0,
		total = 0,
		saldo = 0,
		iva = v_iva / 100, 
		inguat = v_inguat / 100
	where 
		serie = new.serie and 
		tipo_transaccion = new.tipo_transaccion and 
		documento = new.documento;
	
	-- ACTUALIZAR CORRELATIVO
	update correlativo 
	set siguiente = new.documento + 1
	where 
		serie = new.serie and 
		tipo_transaccion = new.tipo_transaccion;
	return new;
end;
$$;	
-- -----------------------------------------------------
create trigger trg_add_tranenc
	after insert on encabezado_transaccion 
	for each row 
		execute procedure trgfn_add_tranenc();
-- -----------------------------------------------------
-- Trigger update encabezado_transaccion
-- -----------------------------------------------------
create or replace function trgfn_upd_tranenc()
returns trigger language plpgsql as $$
declare 
	v_saldo numeric(12,2);
	v_aumento numeric(12,2);
begin	
	v_aumento = new.saldo - old.saldo;

	if v_aumento <> 0 and old.tipo_transaccion = 'CI' then
		select c.saldo 
		into v_saldo 
		from cliente c 
		where c.codigo = old.cliente ; 
		
		update cliente 
		set saldo = v_saldo + v_aumento 
		where codigo = old.cliente;
	end if;

	return new;
end;
$$;	
-- -----------------------------------------------------
create trigger trg_upd_tranenc
	after update on encabezado_transaccion 
	for each row 
		execute procedure trgfn_upd_tranenc();
-- -----------------------------------------------------
-- Trigger insert detalle_transaccion
-- -----------------------------------------------------
create or replace function trgfn_add_trandet()
returns trigger language plpgsql as $$
declare
	v_total numeric = 0;
	v_iva numeric(5,2) = 0;
	v_inguat numeric(5,2) = 0;
	v_new_total numeric(12,2) = 0;
	v_old_total numeric(12,2) = 0;
	v_old_saldo numeric(12,2) = 0;
begin 
	select et.total , et.saldo , et.iva , et.inguat 
	into v_old_total, v_old_saldo , v_iva , v_inguat 
	from encabezado_transaccion et  
	where 
		et.serie = new.serie and 
		et.tipo_transaccion = new.tipo_transaccion and 
		et.documento = new.documento;
	
	v_new_total = v_old_total + new.subtotal;
	
	update encabezado_transaccion 
	set 
		subtotal = v_new_total / (1 + v_iva), 
		total = v_new_total,
		saldo = v_old_saldo + new.subtotal
	where 
		serie = new.serie and 
		tipo_transaccion = new.tipo_transaccion and 
		documento = new.documento;
	
	return new;
end;
$$;	
-- -----------------------------------------------------
create trigger trg_add_trandet
	after insert on detalle_transaccion  
	for each row 
		execute procedure trgfn_add_trandet();
-- -----------------------------------------------------
-- Trigger update detalle_transaccion
-- -----------------------------------------------------
create or replace function trgfn_upd_trandet()
returns trigger language plpgsql as $$
declare
	v_aumento numeric(12,2);
	v_total numeric(12,2) = 0;
	v_iva numeric(5,2) = 0;
	v_inguat numeric(5,2) = 0;
	v_new_total numeric(12,2) = 0;
	v_old_total numeric(12,2) = 0;
	v_old_saldo numeric(12,2) = 0;
begin 
	v_aumento = new.subtotal - old.subtotal;

	if v_aumento <> 0 then 
		select et.total , et.saldo , et.iva , et.inguat 
		into v_old_total, v_old_saldo , v_iva , v_inguat 
		from encabezado_transaccion et  
		where 
			et.serie = new.serie and 
			et.tipo_transaccion = new.tipo_transaccion and 
			et.documento = new.documento;
		
		v_new_total = v_old_total + v_aumento;
		
		update encabezado_transaccion 
		set 
			subtotal = v_new_total / (1 + v_iva), 
			total = v_new_total,
			saldo = v_old_saldo + v_aumento
		where 
			serie = new.serie and 
			tipo_transaccion = new.tipo_transaccion and 
			documento = new.documento;
	end if;
	
	return new;
end;
$$;	
-- -----------------------------------------------------
create trigger trg_upd_trandet
	after update on detalle_transaccion  
	for each row 
		execute procedure trgfn_upd_trandet();
-- -----------------------------------------------------
-- Trigger delete detalle_transaccion
-- -----------------------------------------------------
create or replace function trgfn_rem_trandet()
returns trigger language plpgsql as $$
declare
	v_total numeric = 0;
	v_iva numeric(5,2) = 0;
	v_inguat numeric(5,2) = 0;
	v_new_total numeric(12,2) = 0;
	v_old_total numeric(12,2) = 0;
	v_old_saldo numeric(12,2) = 0;
begin 
	select et.total , et.saldo , et.iva , et.inguat 
	into v_old_total, v_old_saldo , v_iva , v_inguat 
	from encabezado_transaccion et  
	where 
		et.serie = new.serie and 
		et.tipo_transaccion = new.tipo_transaccion and 
		et.documento = new.documento;
	
	v_new_total = v_old_total - new.subtotal;
	
	update encabezado_transaccion 
	set 
		subtotal = v_new_total / (1 + v_iva), 
		total = v_new_total,
		saldo = v_old_saldo - new.subtotal
	where 
		serie = new.serie and 
		tipo_transaccion = new.tipo_transaccion and 
		documento = new.documento;
	
	return new;
end;
$$;	
-- -----------------------------------------------------
create trigger trg_rem_trandet
	after delete on detalle_transaccion  
	for each row 
		execute procedure trgfn_rem_trandet();
-- -----------------------------------------------------
-- Trigger insert encabezado_recibo
-- -----------------------------------------------------
create or replace function trgfn_add_rcenc()
returns trigger language plpgsql as $$
declare
begin 
	-- ACTUALIZAR CORRELATIVO
	update correlativo 
	set siguiente = new.documento + 1
	where 
		serie = new.serie and 
		tipo_transaccion = new.tipo_transaccion;
	return new;
	
	return new;
end;
$$;	
-- -----------------------------------------------------
create trigger trg_add_rcenc
	after insert on encabezado_recibo  
	for each row 
		execute procedure trgfn_add_rcenc();
-- -----------------------------------------------------
-- Trigger after insert detalle_recibo
-- -----------------------------------------------------
create or replace function trgfn_add_rcdet()
returns trigger language plpgsql as $$
declare
	v_abono numeric = 0;
	v_saldo numeric = 0;
	v_total numeric = 0;
	v_iva numeric = 0;
	v_new_total numeric = 0;
begin 
	select er.abono into v_abono 
	from encabezado_recibo er 
	where 
		er.serie = new.serie and 
		er.tipo_transaccion = new.tipo_transaccion and 
		er.documento = new.documento;

	select et.saldo , et.total , et.iva 
	into v_saldo , v_total , v_iva 
	from encabezado_transaccion et  
	where 
		et.serie = new.serie_fac and 
		et.tipo_transaccion = new.ti_tran_fac and 
		et.documento = new.documento_fac;
		
	update encabezado_transaccion 
	set saldo = v_saldo - new.monto
	where 
		serie = new.serie_fac and 
		tipo_transaccion = new.ti_tran_fac and 
		documento = new.documento_fac;
	
	update encabezado_recibo 
	set abono = v_abono + new.monto
	where 
		serie = new.serie and 
		tipo_transaccion = new.tipo_transaccion and 
		documento = new.documento;
	
	return new;
end;
$$;	
-- -----------------------------------------------------
create trigger trg_add_rcdet
	after insert on detalle_recibo  
	for each row 
		execute procedure trgfn_add_rcdet();
-- -----------------------------------------------------
-- Trigger after update detalle_recibo
-- -----------------------------------------------------
create or replace function trgfn_upd_rcdet()
returns trigger language plpgsql as $$
declare
	v_aumento numeric = 0;
	v_abono numeric = 0;
	v_saldo numeric = 0;
	v_total numeric = 0;
	v_iva numeric = 0;
	v_new_total numeric = 0;
begin 
	v_aumento = new.monto - old.monto;
	
	if v_aumento <> 0 then 
		select er.abono into v_abono 
		from encabezado_recibo er 
		where 
			er.serie = new.serie and 
			er.tipo_transaccion = new.tipo_transaccion and 
			er.documento = new.documento;
	
		select et.saldo , et.total 
		into v_saldo , v_total 
		from encabezado_transaccion et  
		where 
			et.serie = new.serie_fac and 
			et.tipo_transaccion = new.ti_tran_fac and 
			et.documento = new.documento_fac;
			
		update encabezado_transaccion 
		set saldo = v_saldo + v_aumento
		where 
			serie = new.serie_fac and 
			tipo_transaccion = new.ti_tran_fac and 
			documento = new.documento_fac;
		
		update encabezado_recibo 
		set abono = v_abono + v_aumento 
		where 
			serie = new.serie and 
			tipo_transaccion = new.tipo_transaccion and 
			documento = new.documento;
	end if;
	
	return new;
end;
$$;	
-- -----------------------------------------------------
create trigger trg_upd_rcdet
	after update on detalle_recibo  
	for each row 
		execute procedure trgfn_upd_rcdet();
-- -----------------------------------------------------
-- Trigger after delete detalle_recibo
-- -----------------------------------------------------
create or replace function trgfn_rem_rcdet()
returns trigger language plpgsql as $$
declare
	v_abono numeric = 0;
	v_saldo numeric = 0;
	v_total numeric = 0;
	v_iva numeric = 0;
	v_new_total numeric = 0;
begin 
	select er.abono into v_abono 
	from encabezado_recibo er 
	where 
		er.serie = new.serie and 
		er.tipo_transaccion = new.tipo_transaccion and 
		er.documento = new.documento;

	select et.saldo , et.total , et.iva 
	into v_saldo , v_total , v_iva 
	from encabezado_transaccion et  
	where 
		et.serie = new.serie_fac and 
		et.tipo_transaccion = new.ti_tran_fac and 
		et.documento = new.documento_fac;
		
	update encabezado_transaccion 
	set saldo = v_saldo + new.monto
	where 
		serie = new.serie_fac and 
		tipo_transaccion = new.ti_tran_fac and 
		documento = new.documento_fac;
	
	update encabezado_recibo 
	set abono = v_abono - new.monto
	where 
		serie = new.serie and 
		tipo_transaccion = new.tipo_transaccion and 
		documento = new.documento;
	
	return new;
end;
$$;	
-- -----------------------------------------------------
create trigger trg_rem_rcdet
	after delete on detalle_recibo  
	for each row 
		execute procedure trgfn_rem_rcdet();
-- 
-- -----------------------------------------------------
-- CREATE VIEWS
-- -----------------------------------------------------
-- 
-- -----------------------------------------------------
-- Vista habitacion
-- -----------------------------------------------------
drop view if exists v_habitacion ;
create view v_habitacion as
select h.codigo, 
  h.nombre, 
  h.descripcion, 
  'Q.' || to_char(h.precio, '999G999D99') as precio, 
  h.estado, 
  h.nivel, 
  n.nombre as n_nombre, 
  h.area, 
  a.nombre as a_nombre, 
  h.tipo, 
  th.nombre as th_nombre , 
  null as fecha_ingreso 
from habitacion h 
  inner join area a on h.area = a .codigo 
  inner join tipo_habitacion th on h.tipo = th.codigo 
  inner join nivel n on h.nivel = n.codigo
order by nivel asc, codigo asc ; 
-- -----------------------------------------------------
-- Vista servicio
-- -----------------------------------------------------
drop view if exists v_servicio ;
create view v_servicio as
select s.codigo,
  s.nombre,
  s.descripcion,
  'Q.' || to_char(s.precio_unitario, '999G999D99') as precio_unitario,
  'Q.' || to_char(s.precio_mayorista, '999G999D99') as precio_mayorista,
  s.tipo ,
  ts.nombre as ts_nombre
from servicio s
  inner join tipo_servicio ts on s.tipo = ts.codigo;
-- -----------------------------------------------------
-- Vista cliente
-- -----------------------------------------------------
drop view if exists v_cliente ;
create view v_cliente as
select c .codigo,
  c.nombre,
  c.nombre_c,
  c.nit,
  c.direccion,
  c.telefono_celular,
  c.telefono_casa,
  c.tipo_cliente,
  c.dpi,
  c.no_pasaporte,
  c.profesion,
  c.cedula,
  c.estado_civil,
  c.pais_origen,
  c.extendido_en,
  c.nombre_factura nombre_fac , 
  c.nit_factura nit_fac ,
  c.saldo , 
  'Q.' || to_char(c.saldo, '999G999D99') as str_saldo,
  p.nombre as po_nombre
from cliente c
  inner join pais p on c .pais_origen = p.codigo;
-- -----------------------------------------------------
-- Vista transaccion
-- -----------------------------------------------------
drop view if exists v_transaccion ;
create view v_transaccion as
select et.serie,
  et.tipo_transaccion,
  et.documento,
  et.fecha,
  et.referencia,
  to_char(et.fecha_salida, 'DD/MM/YYYY') as fecha_salida,
  to_char(et.fecha_ingreso, 'DD/MM/YYYY') as fecha_ingreso,
  et.fecha_ingreso as fecha_ingreso_ts,
  'Q.' || to_char(et.subtotal, '999G999D99') as subtotal,
  'Q.' || to_char(et.total, '999G999D99') as total,
  'Q.' || to_char(et.saldo, '999G999D99') as saldo,
  et.numero_personas,
  et.estado,
  et.nombre_factura,
  et.nit_factura,
  et.direccion_factura,
  et.iva,
  et.inguat,
  et.tipo_cambio, 
  et.vendedor , 
  v.nombre as v_nombre,
  et.cliente , 
  c.nombre as c_nombre,
  c.telefono_celular as c_telefono
from encabezado_transaccion et
  inner join vendedor v on et.vendedor = v.codigo
  inner join cliente c on et.cliente = c .codigo;
-- -----------------------------------------------------
-- Vista reporte servicio
-- -----------------------------------------------------
drop view if exists v_reporte_servicio ;
create view v_reporte_servicio as
select concat(
    et.tipo_transaccion,
    '-',
    et.serie,
    '-',
    et.documento
  ) as documento,
  et.fecha_ingreso as dat_fecha_ingreso , 
  et.fecha_salida as dat_fecha_salida , 
  to_char(et.fecha_ingreso, 'DD/MM/YYYY') as fecha_ingreso ,
  to_char(et.fecha_salida, 'DD/MM/YYYY') as fecha_salida ,
  dt.tipo_transaccion ,
  dt.descripcion ,
  dt.habitacion ,
  h.nombre as h_nombre , 
  dt.subtotal as num_subtotal , 
  'Q.' || to_char(dt.subtotal, '999G999D99') as subtotal ,
  dt.servicio , 
  s.nombre as s_nombre,
  c.codigo as cliente , 
  c.nombre as c_nombre
from detalle_transaccion dt
  left join encabezado_transaccion et on et.serie = dt.serie
  and et.tipo_transaccion = dt.tipo_transaccion
  and et.documento = dt.documento
  left join servicio s on dt.servicio = s.codigo
  left join cliente c on et.cliente = c .codigo
  inner join habitacion h on dt.habitacion = h.codigo ; 
-- -----------------------------------------------------
-- Vista reporte transacción
-- -----------------------------------------------------
drop view if exists v_reporte_transaccion ;
create view v_reporte_transaccion as
select concat(
    et.tipo_transaccion,
    '-',
    et.serie,
    '-',
    et.documento
  ) as documento,
  et.tipo_transaccion,
  et.serie,
  et.fecha_ingreso as dat_fecha_ingreso , 
  et.fecha_salida as dat_fecha_salida , 
  to_char(et.fecha_ingreso, 'DD/MM/YYYY') as fecha_ingreso,
  to_char(et.fecha_salida, 'DD/MM/YYYY') as fecha_salida,
  'Q.' || to_char(et.subtotal, '999G999D99') as str_subtotal,
  'Q.' || to_char(et.total, '999G999D99') as str_total,
  'Q.' || to_char(et.saldo, '999G999D99') as str_saldo,
  h.nombre as n_habitacion , 
  et.subtotal,
  et.total,
  et.saldo,
  et.numero_personas,
  et.cliente,
  coalesce (et.vendedor, 0) as vendedor,
  c.nombre as n_cliente,
  coalesce (v.nombre, '') as n_vendedor
from encabezado_transaccion et
  inner join detalle_transaccion dt 
  	on et.serie = dt.serie 
  	and et.tipo_transaccion = dt.tipo_transaccion 
  	and et.documento = dt.documento 
  inner join habitacion h 
  	on dt.habitacion = h.codigo 
  left join cliente c on et.cliente = c .codigo
  left join vendedor v on et.vendedor = v.codigo;
-- -----------------------------------------------------
-- Vista detalle_transacción
-- -----------------------------------------------------
drop view if exists v_tran_detalle ;
create view v_tran_detalle as 
	select
		dt.serie , dt.tipo_transaccion , dt.documento , 
		concat(dt.tipo_transaccion, '-', dt.serie, '-', dt.documento) as codigo, 
		to_char(dt.fecha , 'DD/MM/YYYY') as fecha, 
		dt.descripcion , dt.habitacion , dt.servicio , 
		dt.cantidad , 
		'Q.' || to_char(dt.precio, '999G999D99') as precio , 
		'Q.' || to_char(dt.subtotal, '999G999D99') as dt_subtotal , 
		'Q.' || to_char(et.subtotal, '999G999D99') as et_subtotal , 
		'Q.' || to_char(et.total, '999G999D99') as total , 
		'Q.' || to_char(et.saldo, '999G999D99') as saldo ,
		to_char(et.fecha_ingreso, 'DD/MM/YYYY') as fecha_ingreso , 
		to_char(et.fecha_salida, 'DD/MM/YYYY') as fecha_salida , 
		et.estado , et.numero_personas , 
		et.cliente , et.nombre_factura , et.vendedor , v.nombre as v_nombre
	from detalle_transaccion dt 
	inner join encabezado_transaccion et 
		on dt.serie = et.serie 
		and dt.tipo_transaccion = et.tipo_transaccion 
		and dt.documento = et.documento
	inner join vendedor v 
		on et.vendedor = v.codigo ;
-- -----------------------------------------------------
-- Vista encabezado_recibo
-- -----------------------------------------------------
drop view if exists v_rc_encabezado ;
create view v_rc_encabezado as
 select 
	 er.serie , er.tipo_transaccion , er.documento ,
	 dr.serie_fac , dr.ti_tran_fac , dr.documento_fac , 
	 to_char(er.fecha, 'DD/MM/YYYY') as fecha , 
	 'Q.' || to_char(er.abono, '999G999D99') as abono ,
	 er.cliente , c.nombre as c_nombre , er.cobrador , v.nombre as v_nombre 
 from encabezado_recibo er
 inner join detalle_recibo dr 
	 on dr.serie = er.serie 
	 and dr.tipo_transaccion = er.tipo_transaccion 
	 and dr.documento = er.documento 
 inner join cliente c
 	on er.cliente = c.codigo 
 inner join vendedor v
 	on er.cobrador = v.codigo ;
-- -----------------------------------------------------
-- Vista detalle_recibo
-- -----------------------------------------------------
drop view if exists v_rc_detalle ;
create view v_rc_detalle as
	select 
		er.serie , er.tipo_transaccion , er.documento ,
		dr.serie_fac , dr.ti_tran_fac , dr.documento_fac ,
		er.fecha as eng_fecha, 
		to_char(er.fecha, 'DD/MM/YYYY') as fecha , 
		to_char(er.fecha, 'HH24:MI:SS') as hora ,
		er.abono ,
		dr.descripcion , 'Q.' || to_char(dr.monto, '999G999D99') as monto ,
		dr.tipo_pago , tp.nombre as tp_nombre ,
		er.cliente , 
		coalesce  (c.nombre, '') as c_nombre , 
		coalesce  (er.cobrador, 0) as cobrador , 
		coalesce (v.nombre, '') as v_nombre 
	from detalle_recibo dr
	inner join encabezado_recibo er 
		on dr.serie = er.serie 
		and dr.tipo_transaccion = er.tipo_transaccion 
		and dr.documento = er.documento 
	inner join tipo_pago tp 
		on dr.tipo_pago = tp.codigo 
	inner join cliente c
		on er.cliente = c.codigo 
	left join vendedor v
		on er.cobrador = v.codigo ;
-- -----------------------------------------------------
-- Vista compras
-- -----------------------------------------------------
drop view if exists v_pp_tranenc ;
create view v_pp_tranenc as 
	select 
		pt.codigo, 
		pt.serie , pt.tipo_transaccion , pt.documento ,
		to_char(pt.fecha, 'DD/MM/YYYY') as fecha ,
		pt.descripcion , 
		pt.proveedor , 
		p.nombre , p.direccion , p.telefono , p.nit,  
		'Q.' || to_char(pt.iva, '999G999D99') as iva , 
		'Q.' || to_char(pt.total, '999G999D99') as total  
	from pp_tranenc pt 
	inner join proveedor p on pt.proveedor = p.codigo ;
-- 
-- -----------------------------------------------------
-- CREATE FUNCTIONS
-- -----------------------------------------------------
-- 
-- -----------------------------------------------------
-- Función para obtener los permisos de página
-- -----------------------------------------------------
create 
or replace function fn_permisos_pagina (n_funcion varchar(50), cod_perfil int, val_estado int)
returns setof pagina as $$
declare paginas pagina % rowtype;
begin return query
select pag. *
from permiso perm
  inner join pagina pag on pag.codigo = perm.pagina
  inner join funcion func on func.codigo = perm.funcion
  inner join perfil p on p.codigo = perm.perfil 
where 
	func.nombre = n_funcion and 
	p.codigo  = cod_perfil and 
	perm.estado = val_estado 
order by pag.indice asc ; 
end;
$$ language plpgsql;
-- -----------------------------------------------------
-- Función para obtener la última transacción
-- -----------------------------------------------------
create
or replace function fn_tranenc_hab (codHabitacion int, titran varchar(3), p_estado int) 
returns setof encabezado_transaccion as $$
declare 
	tranEnc encabezado_transaccion % rowtype;
begin return query
	select et. *
	from encabezado_transaccion et
	inner join detalle_transaccion dt on et.serie = dt.serie
		and et.tipo_transaccion = dt.tipo_transaccion
		and et.documento = dt.documento
	where dt.habitacion = codHabitacion
		and et.tipo_transaccion = titran 
		and et.estado = p_estado
	order by et.fecha desc
	limit 1;
end;
$$ language plpgsql;
-- -----------------------------------------------------
-- Función para actualizar estado de habitación
-- -----------------------------------------------------
create 
or replace procedure sp_update_hab () 
language plpgsql as $$
declare 
	rec record;
begin 
	for rec in 
		select
			now()::Date ,  
			dt.habitacion ,
			et.fecha_ingreso::Date fecha_ingreso , 
			et.fecha_salida::Date fecha_salida 
		from detalle_transaccion dt
		inner join encabezado_transaccion et
			on dt.serie = et.serie 
			and dt.tipo_transaccion = et.tipo_transaccion 
			and dt.documento = et.documento 
		where et.tipo_transaccion = 'RE'
		and dt.servicio = 1 
		and et.estado = 0
	loop 
		if now()::Date >= rec.fecha_ingreso::Date and now()::Date <= rec.fecha_salida::Date then
			update habitacion 
			set estado = 'R'
			where codigo = rec.habitacion;
		end if ; 
	end loop ; 
	
	commit;
end ; $$;
-- -----------------------------------------------------
-- Procedimiento de cierre
-- -----------------------------------------------------
create 
or replace procedure sp_saldos() 
language plpgsql 
as $$ 
declare
	-- variable declaration
	rec record;
	v_saldo numeric = 0;
begin 
	--stored procedure body
	for rec in 
		select et.saldo , et.cliente  
		from encabezado_transaccion et 
		where et.tipo_transaccion = 'CI' 
		or (et.tipo_transaccion = 'RE' and et.estado = 0)
	loop 
		select c.saldo 
		into v_saldo
		from cliente c 
		where c.codigo = rec.cliente;
		
		update cliente 
		set saldo = v_saldo + rec.saldo
		where codigo = rec.cliente;
	end loop;
end; $$

--
-- -----------------------------------------------------
-- DEFAULT ROWS
-- -----------------------------------------------------
--
insert into servicio
(codigo, nombre, descripcion, precio_unitario, precio_mayorista, tipo)
overriding system value
values
(1, 'Habitación', 'Alquiler de habitación', 0, 0, 3);

--
-- -----------------------------------------------------
-- CONFIG numeric(5,2)
-- -----------------------------------------------------
--
-- show lc_monetary;

-- set lc_monetary to "es_GT.utf8";
-- select 7560.5::money;
--