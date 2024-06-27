import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Importa el paquete cors
import { notFound, errorHandler, auth } from './middlewares.js';
import categoriaRouter from './api/categorias.js';
import compraRouter from './api/compras.js';
import marcaRouter from './api/marcas.js';
import masvendidoRouter from './api/masvendidos.js';
import menosvendidoRouter from './api/menosvendidos.js';
import recienagregadosRouter from './api/recienagregados.js';
import productoRouter from './api/productos.js';
import proveedorRouter from './api/proveedores.js';
import ventaRouter from './api/ventas.js';
import seleccionarproductoRouter from './api/seleccionarproductos.js';
import seleccionarproveedorRouter from './api/seleccionarproveedor.js';
import obtenertotalventasRouter from './api/obtenertotalventas.js';

import authRouter from './auth.js';
import { PORT } from './config.js';

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());

// Configurar CORS para permitir cualquier origen
app.use(cors({
  origin: '*', // Permite solicitudes desde cualquier origen
  methods: 'GET,POST,PUT,DELETE',
  credentials: true // Permite el envío de cookies
}));

//EL USE SE USA PARA AGREGAR CARACTERISTICASA A NUESTRO SERVIDOR APP.

// Rutas de autenticación
app.use('/auth', authRouter);

// Rutas protegidas
app.use('/api/categorias', auth, categoriaRouter);
app.use('/api/compras', auth, compraRouter);
app.use('/api/marcas', auth, marcaRouter);
app.use('/api/masvendido', auth, masvendidoRouter);
app.use('/api/menosvendido', auth, menosvendidoRouter);
app.use('/api/recienagregados', auth, recienagregadosRouter);
app.use('/api/productos', auth, productoRouter);
app.use('/api/proveedores', auth, proveedorRouter);
app.use('/api/ventas', auth, ventaRouter);
app.use('/api/seleccionarproductos', auth, seleccionarproductoRouter);
app.use('/api/seleccionarproveedores', auth, seleccionarproveedorRouter);
app.use('/api/obtenertotalventas', auth, obtenertotalventasRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
