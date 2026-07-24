require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Home page - Create User
app.get('/', (req, res) => {
    res.render("index");
});

// Read Users
app.get('/read', async (req, res) => {
    let users = await userModel.find();
    res.render("read", { users });
});

// Create User
app.post('/create', async (req, res) => {
    let { name, email, imageurl } = req.body;
    try {
        await userModel.create({
            name,
            email,
            image: imageurl
        });
        res.redirect('/read');
    } catch (err) {
        if (err.code === 11000) {
            return res.send("❌ Yeh email already exist karti hai. Doosri email use karo.");
        }
        res.send("❌ Kuch error aa gaya: " + err.message);
    }
});

// Delete User
app.get('/delete/:id', async (req, res) => {
    await userModel.findByIdAndDelete(req.params.id);
    res.redirect('/read');
});

// Show Edit Form
app.get('/edit/:id', async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.send("User not found");
    res.render('edit', { user });
});

// Handle Update
app.post('/edit/:id', async (req, res) => {
    let { name, email, imageurl } = req.body;
    await userModel.findByIdAndUpdate(req.params.id, {
        name,
        email,
        image: imageurl
    });
    res.redirect('/read');
});

// Local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

module.exports = app;
