
const express = require('express');
const router = express.Router();
const pool = require('../db');


// 21 Reporte Global
router.get('/ejercicio-21', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.name AS usuario,
                u.city AS ciudad,
                o.order_number AS numero_orden,
                p.name AS producto,
                c.name AS categoria,
                op.quantity AS cantidad,
                (op.quantity * op.price_at_purchase) AS subtotal
            FROM orders o
            JOIN users u ON u.id = o.user_id
            JOIN order_product op ON op.order_id = o.id
            JOIN products p ON p.id = op.product_id
            JOIN categories c ON c.id = p.category_id
            ORDER BY o.order_number
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 22 Ventas de Ropa en una ciudad específica ******************SOLUCIONAR
// router.get('/ejercicio-22/:city', async (req, res) => {
//     try {
//         const { city } = req.params;

//         const [rows] = await pool.query(`
//             SELECT 
//                 SUM(op.quantity * op.price_at_purchase) AS total_ropa
//             FROM orders o
//             JOIN users u ON u.id = o.user_id
//             JOIN order_product op ON op.order_id = o.id
//             JOIN products p ON p.id = op.product_id
//             JOIN categories c ON c.id = p.category_id
//             WHERE c.name = 'Ropa'
//             AND u.city = ?
//         `, [city]);

//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// 23 Cliente del Año
router.get('/ejercicio-23', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.name,
                SUM(op.quantity * op.price_at_purchase) AS total_gastado
            FROM users u
            JOIN orders o ON o.user_id = u.id
            JOIN order_product op ON op.order_id = o.id
            GROUP BY u.id
            ORDER BY total_gastado DESC
            LIMIT 1
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 24 Productos sin ninguna venta ******************SOLUCIONAR
// router.get('/ejercicio-24', async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//             SELECT p.name
//             FROM products p
//             LEFT JOIN order_product op ON op.product_id = p.id
//             WHERE op.product_id IS NULL
//         `);

//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// 25 Ganancia Real total
router.get('/ejercicio-25', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                SUM((op.price_at_purchase - p.purchase_price) * op.quantity) AS ganancia_total
            FROM order_product op
            JOIN products p ON p.id = op.product_id
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 26 Usuarios que compraron Videojuegos pero no Hogar ******************SOLUCIONAR
// router.get('/ejercicio-26', async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//             SELECT DISTINCT u.name
//             FROM users u
//             WHERE EXISTS (
//                 SELECT 1
//                 FROM orders o
//                 JOIN order_product op ON op.order_id = o.id
//                 JOIN products p ON p.id = op.product_id
//                 JOIN categories c ON c.id = p.category_id
//                 WHERE o.user_id = u.id
//                 AND c.name = 'Videojuegos'
//             )
//             AND NOT EXISTS (
//                 SELECT 1
//                 FROM orders o
//                 JOIN order_product op ON op.order_id = o.id
//                 JOIN products p ON p.id = op.product_id
//                 JOIN categories c ON c.id = p.category_id
//                 WHERE o.user_id = u.id
//                 AND c.name = 'Hogar'
//             )
//         `);

//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// 27 Top 3 ciudades con más ingresos
router.get('/ejercicio-27', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.city,
                SUM(op.quantity * op.price_at_purchase) AS ingresos
            FROM users u
            JOIN orders o ON o.user_id = u.id
            JOIN order_product op ON op.order_id = o.id
            GROUP BY u.city
            ORDER BY ingresos DESC
            LIMIT 3
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 28 Orden con mayor variedad de productos distintos
router.get('/ejercicio-28', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                o.order_number,
                COUNT(DISTINCT op.product_id) AS productos_distintos
            FROM orders o
            JOIN order_product op ON op.order_id = o.id
            GROUP BY o.id
            ORDER BY productos_distintos DESC
            LIMIT 1
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 29 Productos vendidos antes a menor precio que el actual ******************SOLUCIONAR
// router.get('/ejercicio-29', async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//             SELECT DISTINCT p.name
//             FROM products p
//             JOIN order_product op ON op.product_id = p.id
//             WHERE op.price_at_purchase < p.purchase_price
//         `);

//         res.json(rows);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


// 30 Historial de compras de un producto específico
router.get('/ejercicio-30/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        const [rows] = await pool.query(`
            SELECT 
                u.name AS usuario,
                o.order_date AS fecha,
                op.price_at_purchase AS precio_pagado,
                op.quantity
            FROM order_product op
            JOIN orders o ON o.id = op.order_id
            JOIN users u ON u.id = o.user_id
            WHERE op.product_id = ?
            ORDER BY o.order_date DESC
        `, [productId]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
