const express = require('express');
const router = express.Router();
const pool = require('../db');


// 11 Recibo detallado por número de orden
router.get('/ejercicio-11/:orderNumber', async (req, res) => {
    try {
        const { orderNumber } = req.params;

        const [rows] = await pool.query(`
            SELECT 
                o.order_number AS codigo_orden,
                o.order_date AS fecha,
                p.name AS producto,
                op.price_at_purchase AS precio_venta
            FROM orders o
            JOIN order_product op ON op.order_id = o.id
            JOIN products p ON p.id = op.product_id
            WHERE o.order_number = ?
        `, [orderNumber]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 12 Ingreso total por categoría
router.get('/ejercicio-12', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                c.name AS categoria,
                SUM(op.quantity * op.price_at_purchase ) AS ingresos_totales
            FROM categories c
            JOIN products p ON p.category_id = c.id
            JOIN order_product op ON op.product_id = p.id
            GROUP BY c.name
            ORDER BY ingresos_totales DESC
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 13 Productos únicos comprados por cliente (por nombre)
router.get('/ejercicio-13/:customerName', async (req, res) => {
    try {
        const { customerName } = req.params;

        const [rows] = await pool.query(`
            SELECT DISTINCT p.name AS producto
            FROM users u
            JOIN orders o ON o.user_id = u.id
            JOIN order_product op ON op.order_id = o.id
            JOIN products p ON p.id = op.product_id
            WHERE u.name = ?
        `, [customerName]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 14 Top 5 productos más vendidos
router.get('/ejercicio-14', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.name AS producto,
                SUM(op.quantity) AS total_vendidos
            FROM order_product op
            JOIN products p ON p.id = op.product_id
            GROUP BY p.name
            ORDER BY total_vendidos DESC
            LIMIT 5
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 15 Última fecha de venta por producto
router.get('/ejercicio-15', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.name AS producto,
                MAX(o.order_date) AS ultima_venta
            FROM products p
            JOIN order_product op ON op.product_id = p.id
            JOIN orders o ON o.id = op.order_id
            GROUP BY p.name
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 16 Usuarios que compraron productos con "Gamer"
router.get('/ejercicio-16', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT u.name
            FROM users u
            JOIN orders o ON o.user_id = u.id
            JOIN order_product op ON op.order_id = o.id
            JOIN products p ON p.id = op.product_id
            WHERE p.name LIKE '%Gamer%'
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 17 Ingresos totales por día
router.get('/ejercicio-17', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                DATE(o.order_date) AS fecha,
                SUM(op.quantity * op.price_at_purchase) AS ingresos
            FROM orders o
            JOIN order_product op ON op.order_id = o.id
            GROUP BY DATE(o.order_date)
            ORDER BY fecha
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 18 Categorías sin ventas
router.get('/ejercicio-18', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT c.name AS categoria
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id
            LEFT JOIN order_product op ON op.product_id = p.id
            WHERE op.id IS NULL
            GROUP BY c.name
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 19 Ticket promedio por usuario
router.get('/ejercicio-19', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.name,
                AVG(order_total) AS ticket_promedio
            FROM (
                SELECT 
                    o.id,
                    o.user_id,
                    SUM(op.quantity * op.price_at_purchase) AS order_total
                FROM orders o
                JOIN order_product op ON op.order_id = o.id
                GROUP BY o.id
            ) AS sub
            JOIN users u ON u.id = sub.user_id
            GROUP BY u.name
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 20 Productos en órdenes canceladas
router.get('/ejercicio-20', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT p.name AS producto, o.status AS staus
            FROM orders o
            JOIN order_product op ON op.order_id = o.id
            JOIN products p ON p.id = op.product_id
            WHERE o.status = 'cancelled'
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
