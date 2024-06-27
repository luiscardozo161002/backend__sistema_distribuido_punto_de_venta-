import express from 'express';
import { conexion } from '../db.js';

const router = express.Router();

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const [rows, fields] = await conexion.execute('SELECT id_detalleventa, descripcion_producto, cantidad_vendida, precio_unitario, subtotal, fecha, id_producto FROM detalleventas WHERE detalleventas.estado = 1 ORDER BY detalleventas.id_detalleventa DESC;');
        const obj = {};
        if (rows.length > 0) {
            obj.listaVentas = rows;
            res.json(obj);
        } else {
            res.json({ message: 'No hay registros' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.post('/', async (req, res) => {
    const { descripcion_producto, cantidad_vendida } = req.body;
    try {
        const [result] = await conexion.execute('CALL InsertarVenta(?, ?);', [descripcion_producto, cantidad_vendida ]);
        res.json(`Se insertó correctamente la venta con ID: ${result.insertId}`);
    } catch (error) {
        console.error("Error en la inserción:", error.message);
        res.status(500).send('Error en el servidor');
    }
});


router.put('/', async (req, res) => {
    const { id_detalleventa } = req.headers;
    const { cantidad_vendida} = req.body;
    try {
        const [result] = await conexion.execute('CALL ActualizarVenta(?,?);', [id_detalleventa, cantidad_vendida]);
        res.json(`Se actualizó correctamente la venta`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

router.delete('/', async (req, res) => {
    const { id_detalleventa } = req.headers;
    try {
        const [result] = await conexion.execute('CALL EliminarVentaPorEstado(?);', [id_detalleventa]);
        res.json(`Se eliminó correctamente la venta`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});


export default router;