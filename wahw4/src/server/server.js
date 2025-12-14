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

app.listen(port, () => {
    console.log("Server is listening to port " + port)
});