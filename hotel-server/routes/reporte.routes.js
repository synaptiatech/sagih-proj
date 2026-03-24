import { Router } from 'express';
import {
	avg_estance,
	checkinPorTipoHab,
	cierreTurno,
	getReporte,
	getReporteParametrizado,
	habPorDia,
	ingresos,
	masterDetail,
	reporteUsabilidad,
	reporteVentas,
	reporteVentasPorHabitacion,
	reporteVentasYCobros,
	reportesGerenciales,
	salesPerVendedor,
} from '../controllers/reporte.controller.js';
import { ensureAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/master', ensureAuth, masterDetail);
router.post('/cierre', ensureAuth, cierreTurno);
router.post('/all', ensureAuth, getReporte); // agregacion de ensureAuth
router.post('/parametrizado', ensureAuth, getReporteParametrizado); // agregacion de ensureAuth
router.post('/ventas', ensureAuth, reporteVentas);
router.post('/ventas-habitacion', ensureAuth, reporteVentasPorHabitacion);
router.post('/usabilidad', ensureAuth, reporteUsabilidad);
router.post('/ventas-cobros', ensureAuth, reporteVentasYCobros);
router.post('/gerenciales', ensureAuth, reportesGerenciales);
router.post('/hab-dia', ensureAuth, habPorDia);
router.post('/checkin-por-tipo', ensureAuth, checkinPorTipoHab);
router.post('/ingresos', ensureAuth, ingresos);
router.post('/avg_estance', ensureAuth, avg_estance);
router.post('/sales_vendedor', ensureAuth, salesPerVendedor);

export default router;
