import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import cierre from './routes/cierre.routes.js';
import cliente from './routes/cliente.routes.js';
import compras from './routes/compras.routes.js';
import correlativo from './routes/correlativo.routes.js';
import departamento from './routes/departamento.routes.js';
import empresa from './routes/empresa.routes.js';
import funcion from './routes/funcion.routes.js';
import funcionalidad from './routes/funcionalidad.routes.js';
import general from './routes/general.routes.js';
import habitacion from './routes/habitacion.routes.js';
import impuesto from './routes/impuesto.routes.js';
import index from './routes/index.routes.js';
import pagina from './routes/pagina.routes.js';
import pago from './routes/pago.routes.js';
import pais from './routes/pais.routes.js';
import perfil from './routes/perfil.routes.js';
import producto from './routes/producto.routes.js';
import recibo from './routes/recibo.routes.js';
import reporte from './routes/reporte.routes.js';
import saldos from './routes/saldos.routes.js';
import servicio from './routes/servicio.routes.js';
import transaccion from './routes/transaccion.routes.js';
import usuario from './routes/usuario.routes.js';
import vendedor from './routes/vendedor.routes.js';

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(
	cors({
		credentials: true,
	})
);
app.use(
	fileUpload({
		limits: { fileSize: 50 * 1024 * 1024 },
		tempFileDir: '/storage',
	})
);
app.use(express.static('storage'));

app.use('/api', index);
app.use('/api/impuesto', impuesto);
app.use('/api/servicio', servicio);
app.use('/api/pago', pago);
app.use('/api/habitacion', habitacion);
app.use('/api/funcion', funcion);
app.use('/api/pagina', pagina);
app.use('/api/perfil', perfil);
app.use('/api/permiso', funcionalidad);
app.use('/api/usuario', usuario);
app.use('/api/cliente', cliente);
app.use('/api/vendedor', vendedor);
app.use('/api/transaccion', transaccion);
app.use('/api/recibo', recibo);
app.use('/api/pais', pais);
app.use('/api/departamento', departamento);
app.use('/api/reporte', reporte);
app.use('/api/producto', producto);
app.use('/api/compra', compras);
app.use('/api/empresa', empresa);
app.use('/api/cierre', cierre);
app.use('/api/correlativo', correlativo);
app.use('/api/general', general);
app.use('/api/saldos', saldos);

export default app;
