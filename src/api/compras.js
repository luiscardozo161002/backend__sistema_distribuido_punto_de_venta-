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
        const [rows, fields] = await conexion.execute('SELECT detallecompras.id_detallecompra, descripcion_producto, cantidad_comprada, precio_unitario, subtotal, fecha, nombre_proveedor, proveedores.id_proveedor, id_producto FROM detallecompras INNER JOIN proveedores ON detallecompras.id_proveedor = proveedores.id_proveedor WHERE detallecompras.estado = 1 ORDER BY detallecompras.id_detallecompra DESC;');
        if (rows.length > 0) {
            res.json({ listaCompras: rows });
        } else {
            res.json({ message: 'No hay registros' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.post('/', async (req, res) => {
    const { descripcion_producto, cantidad_comprada, nombre_proveedor } = req.body;

    if (!descripcion_producto || !cantidad_comprada || !nombre_proveedor) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    try {
        const [result] = await conexion.execute('CALL InsertarCompra(?, ?, ?);', [descripcion_producto, cantidad_comprada, nombre_proveedor]);
        res.json(`Se insertó correctamente la compra con ID: ${result.insertId}`);
    } catch (error) {
        console.error("Error en la inserción:", error.message);
        res.status(500).send('Error en el servidor');
    }
});

router.put('/', async (req, res) => {
    const { id_detallecompra } = req.headers;
    const { descripcion_producto, cantidad_comprada, nombre_proveedor } = req.body;

    if (!id_detallecompra || !descripcion_producto || !cantidad_comprada || !nombre_proveedor) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    try {
        const [result] = await conexion.execute('CALL ActualizarCompra(?,?,?,?);', [id_detallecompra, descripcion_producto, cantidad_comprada, nombre_proveedor]);
        res.json(`Se actualizó correctamente la compra`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

router.delete('/', async (req, res) => {
    const { id_detallecompra } = req.headers;

    if (!id_detallecompra) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos' });
    }

    try {
        const [result] = await conexion.execute('CALL EliminarCompraPorEstado(?);', [id_detallecompra]);
        res.json(`Se eliminó correctamente la compra`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

export default router;
