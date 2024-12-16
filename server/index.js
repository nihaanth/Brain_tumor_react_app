const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');




const app = express();

app.use(cors());
app.use(express.json());

// Database connections
const loginSignupDB = mongoose.createConnection('mongodb://localhost:27017/Login', { useNewUrlParser: true, useUnifiedTopology: true });

const loginSignupSchema = new mongoose.Schema({
    email: String,
    password: String
});

const LoginSignupModel = loginSignupDB.model("Logins", loginSignupSchema);

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await LoginSignupModel.findOne({ email });

        if (user) {
            if (user.password === password) {
                res.json({ message: 'Login successful', user });
            } else {
                res.status(401).json({ message: 'Incorrect password' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        let existingUser = await LoginSignupModel.findOne({ email });

        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
        } else {
            const newUser = new LoginSignupModel({ email, password });
            const savedUser = await newUser.save();
            res.status(201).json({ message: 'User created successfully', user: savedUser });
        }
    } catch (error) {
        console.error('Error during sign up:', error);
        res.status(500).json({ message: 'An error occurred during sign up' });
    }
});


// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
}).single('image');

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle image upload and respond with the file path
app.post('/predict', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        res.send({ filePath: `/uploads/${req.file.filename}` });
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});