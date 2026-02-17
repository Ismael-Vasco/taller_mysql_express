const express = require('express');
const router = express.Router();
const pool = require('../db');


// 1️ Nombre, email y order_number de un usuario específico
router.get('/ejercicio-1/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const [rows] = await pool.query(`
            SELECT u.name, u.email, o.order_number
            FROM users u
            JOIN orders o ON u.id = o.user_id
            WHERE u.id = ?
        `, [userId]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 2️ Pedidos por email específico ejemplo sedillo.yago@live.com
router.get('/ejercicio-2/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const [rows] = await pool.query(`
            SELECT o.order_number, o.order_date
            FROM orders o
            JOIN users u ON u.id = o.user_id
            WHERE u.email = ?
        `, [email]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 3️ Producto y su categoría
router.get('/ejercicio-3', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.name AS product_name,
                   c.name AS category_name
            FROM products p
            JOIN categories c ON p.category_id = c.id
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 4️ Usuarios sin compras
router.get('/ejercicio-4', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT u.id, u.name, u.email
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            WHERE o.id IS NULL
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 5️ Total gastado por un usuario
router.get('/ejercicio-5/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const [rows] = await pool.query(`
            SELECT u.name,
                   SUM(op.quantity * o.total) AS total_spent
            FROM users u
            JOIN orders o ON o.user_id = u.id
            JOIN order_product op ON op.order_id = o.id
            WHERE u.id = ?
            GROUP BY u.name
        `, [userId]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 6️ Cantidad de pedidos por status
router.get('/ejercicio-6', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT status, COUNT(*) AS total_orders
            FROM orders
            GROUP BY status
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 7️ Productos de Electrónica ordenados por precio
router.get('/ejercicio-7', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.id, p.name, p.sale_price
            FROM products p
            JOIN categories c ON c.id = p.category_id
            WHERE c.id in (1,2,3,4,5,7)
            ORDER BY p.sale_price DESC
        `);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 8 Productos y cantidades por número de orden ejemplo 'ORD-2026-XM5SYX'
router.get('/ejercicio-8/:orderNumber', async (req, res) => {
    try {
        const { orderNumber } = req.params;

        const [rows] = await pool.query(`
            SELECT op.product_id, op.quantity
            FROM order_product op
            JOIN orders o ON o.id = op.order_id
            WHERE o.order_number = ?
        `, [orderNumber]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 9️ Usuarios de una ciudad con al menos un pedido ejemplo Villa Flores
router.get('/ejercicio-9/:city', async (req, res) => {
    try {
        const { city } = req.params;

        const [rows] = await pool.query(`
            SELECT DISTINCT u.name
            FROM users u
            JOIN orders o ON o.user_id = u.id
            WHERE u.city = ?
        `, [city]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// 10 Promedio de valor de pedidos por usuario
router.get('/ejercicio-10', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT u.name,
                   AVG(order_total) AS average_order_value
            FROM (
                SELECT o.id,
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


module.exports = router;
