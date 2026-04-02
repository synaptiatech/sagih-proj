// =======================
// CAMBIO CLAVE APLICADO
// =======================

// 🔥 1. NORMALIZACIÓN POR SEGUNDO (NO MINUTO)
const normalizeTimestamp = (value) => {
	return String(value).trim().replace('T', ' ');
};

const fecha_apertura = normalizeTimestamp(fecha_apertura_raw);
const fecha_cierre = normalizeTimestamp(fecha_cierre_raw);
const fecha_real = normalizeTimestamp(fecha_real_raw);


// =======================
// 🔥 2. CONSULTA DETALLE CORREGIDA
// =======================

const consultaDetalle = `
	SELECT DISTINCT *
	FROM v_rc_detalle
	WHERE tp_nombre = $1
		AND fecha::timestamp >= $2::timestamp 
		AND fecha::timestamp <= $3::timestamp
`;


// =======================
// 🔥 3. CONSULTA PRINCIPAL (SIN CAMBIOS)
// =======================

const consultaPrincipal = `
	SELECT 
		sum(monto) monto, 
		nombre
	FROM (
		SELECT 
			sum(dr.monto) as monto, 
			tp.nombre 
		FROM detalle_recibo dr 
		INNER JOIN tipo_pago tp ON dr.tipo_pago = tp.codigo
		WHERE dr.fecha::timestamp >= $1::timestamp 
			AND dr.fecha::timestamp <= $2::timestamp 
		GROUP BY tp.nombre 
		UNION 
		SELECT 0 as monto, tp2.nombre 
		FROM tipo_pago tp2 
	) rc
	GROUP BY nombre
	ORDER BY rc.nombre ASC`;


// =======================
// 🔥 4. CONSULTA COMPRAS (SIN CAMBIOS)
// =======================

const consultaCompras = `
	SELECT total
	FROM pp_tranenc
	WHERE fecha::timestamp >= $1::timestamp 
		AND fecha::timestamp <= $2::timestamp`;


// =======================
// 🔥 5. CÁLCULO CORRECTO DE COMPRAS EN RESUMEN
// =======================

const totalComprasNumero = comprasRows.reduce((acc, row) => {
	return acc + (Number(row.total) || 0);
}, 0);


// =======================
// 🔥 6. TOTAL A LIQUIDAR CORREGIDO
// =======================

const efectivoNumero = efectivo ? getNumericValue(efectivo.monto) : 0;
const comprasNumero = totalComprasNumero;

const totalLiquidar = efectivoNumero - comprasNumero;


// =======================
// 🔥 7. RESULTADO FINAL EN RESUMEN
// =======================

reportRows.push({
	nombre: 'Compras',
	monto: formatCurrency(totalComprasNumero),
});

reportRows.push({
	monto: formatCurrency(totalLiquidar),
	nombre: 'TOTAL A LIQUIDAR (Efectivo - Compras)',
});
