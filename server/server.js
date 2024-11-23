const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        createTables();
    }
});

// Create tables
function createTables() {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL
        )`);

        // Orders table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            job_order INTEGER PRIMARY KEY AUTOINCREMENT,
            job_serial TEXT NOT NULL,
            date_of_order TEXT NOT NULL,
            deadline TEXT NOT NULL,
            layout_artist TEXT NOT NULL,
            type TEXT NOT NULL,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            customer_contact TEXT NOT NULL,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'pending'
        )`);

        // Sublimation orders table
        db.run(`CREATE TABLE IF NOT EXISTS sublimation_orders (
            id TEXT PRIMARY KEY,
            order_id INTEGER,
            type TEXT NOT NULL,
            price_per_unit REAL NOT NULL,
            quantity INTEGER NOT NULL,
            total_price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (job_order)
        )`);

        // Insert default users if they don't exist
        db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
            if (err) {
                console.error('Error checking users:', err);
                return;
            }
            if (row.count === 0) {
                const defaultUsers = [
                    { id: '1', name: 'John Doe', role: 'Layout Artist' },
                    { id: '2', name: 'Jane Smith', role: 'Layout Artist' }
                ];
                defaultUsers.forEach(user => {
                    db.run('INSERT INTO users (id, name, role) VALUES (?, ?, ?)',
                        [user.id, user.name, user.role]);
                });
            }
        });
    });
}

// Routes
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    // In production, use proper authentication
    if (password === 'admin123') {
        db.all('SELECT * FROM users', (err, users) => {
            if (err) {
                res.status(500).json({ error: 'Database error' });
                return;
            }
            res.json({ success: true, users });
        });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

app.post('/api/orders', (req, res) => {
    const {
        jobSerial,
        dateOfOrder,
        deadline,
        layoutArtist,
        type,
        customer,
        sublimationOrders,
        totalPrice
    } = req.body;

    db.run(`INSERT INTO orders (
        job_serial, date_of_order, deadline, layout_artist, type,
        customer_name, customer_email, customer_contact, total_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
        jobSerial,
        dateOfOrder,
        deadline,
        layoutArtist,
        type,
        customer.name,
        customer.email,
        customer.contact,
        totalPrice
    ],
    function(err) {
        if (err) {
            res.status(500).json({ error: 'Error creating order' });
            return;
        }

        const orderId = this.lastID;
        const sublimationValues = sublimationOrders.map(order => {
            return [
                order.id,
                orderId,
                order.type,
                order.pricePerUnit,
                order.quantity,
                order.totalPrice
            ];
        });

        const stmt = db.prepare(`INSERT INTO sublimation_orders (
            id, order_id, type, price_per_unit, quantity, total_price
        ) VALUES (?, ?, ?, ?, ?, ?)`);

        sublimationValues.forEach(values => {
            stmt.run(values, (err) => {
                if (err) console.error('Error inserting sublimation order:', err);
            });
        });
        stmt.finalize();

        res.json({ success: true, orderId });
    });
});

app.get('/api/orders', (req, res) => {
    db.all(`
        SELECT o.*, GROUP_CONCAT(json_object(
            'id', s.id,
            'type', s.type,
            'pricePerUnit', s.price_per_unit,
            'quantity', s.quantity,
            'totalPrice', s.total_price
        )) as sublimation_orders
        FROM orders o
        LEFT JOIN sublimation_orders s ON o.job_order = s.order_id
        GROUP BY o.job_order
        ORDER BY o.job_order DESC
    `, (err, orders) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching orders' });
            return;
        }

        const processedOrders = orders.map(order => ({
            ...order,
            sublimation_orders: order.sublimation_orders 
                ? JSON.parse(`[${order.sublimation_orders}]`)
                : []
        }));

        res.json(processedOrders);
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port} (accessible on local network)`);
});
