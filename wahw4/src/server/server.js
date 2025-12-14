const secret = "fe1a1915a379f3be5394b64d14794932";  // Your JWT secret key

const express = require('express');
const pool = require('./database');
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 3000;

const app = express();

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));

app.use(express.json());  
app.use(cookieParser()); 

// Create users table if it doesn't exist
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    )
`;

pool.query(createTableQuery)
    .then(() => console.log('Users table is ready'))
    .catch(err => console.error('Error creating table:', err));

// Create posts table if it doesn't exist
const createPostsTableQuery = `
    CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        body TEXT NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

pool.query(createPostsTableQuery)
    .then(() => console.log('Posts table is ready'))
    .catch(err => console.error('Error creating posts table:', err));

// Middleware to check authentication
const authMiddleware = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        jwt.verify(token, secret);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

app.get('/auth/authenticate', async (req, res) => {
    const token = req.cookies.jwt;
    let authenticated = false;
    try {
        if (token) {
            await jwt.verify(token, secret, (err) => {
                if (err) {
                    console.log(err.message);
                    res.send({ "authenticated": authenticated });
                } else {
                    authenticated = true;
                    res.send({ "authenticated": authenticated });
                }
            });
        } else {
            res.send({ "authenticated": authenticated });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post('/auth/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert user into database
        await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2)',
            [email, hashedPassword]
        );
        
        // Create JWT token
        const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
        
        // Set cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
        
        res.json({ message: 'Signup successful' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user in database
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        const user = result.rows[0];
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Create JWT token
        const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
        
        // Set cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
        
        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/auth/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Logout successful' });
});

// Get all posts
app.get('/api/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY date DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single post by ID
// Get single post by ID
app.get('/api/posts/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Create new post (requires authentication)
app.post('/api/posts', authMiddleware, async (req, res) => {
    try {
        const { body } = req.body;
        const result = await pool.query(
            'INSERT INTO posts (body) VALUES ($1) RETURNING *',
            [body]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update post by ID (requires authentication)
app.put('/api/posts/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req.body;
        const result = await pool.query(
            'UPDATE posts SET body = $1 WHERE id = $2 RETURNING *',
            [body, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete single post by ID (requires authentication)
app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete all posts (requires authentication)
app.delete('/api/posts', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM posts');
        res.json({ message: 'All posts deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log("Server is listening to port " + port)
});