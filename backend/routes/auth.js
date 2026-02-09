const express = require('express');
const crypto = require('crypto');
const authRouter = express.Router();
const db = require('../db/conn');

const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

authRouter.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    if (!passwordPolicy.test(password)) {
        return res.status(400).json({ message: 'Password does not meet complexity requirements' });
    }
    try {
        const existingUser = await db.getDb().collection('users').findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const salt = crypto.randomBytes(16).toString('hex');
        let hash = function (str, salt) {
            if (typeof (str) == 'string' && str.length > 0) {
                let hash = crypto.createHmac('sha256', salt);
                let update = hash.update(str);
                let digest = update.digest('hex');
                return digest;
            } else {
                return null;
            }
        };
        let hashedPassword = hash(password, salt);
        const newUser = {
            username,
            password: hashedPassword,
            salt
        };
        await db.getDb().collection('users').insertOne(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
);
