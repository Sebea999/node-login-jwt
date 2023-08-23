const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'ASDFAS48941*#@485DFSasdfsad8594fdfdd999';
// model
const User = require('./model/user.js');

const db_pass = '123';
mongoose.connect(`mongodb+srv://usermongodb:${db_pass}@db-agend.bja3uzu.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true, 
    useUnifiedTopology: true//, 
   // useCreateIndex: true
});
const app = express();

app.use('/', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());


// 1:06:45
app.post('/api/update-profile', (req, res) => {
    // JWT authentia
    res.json({ status: 'ok' });
});


// 54:00
app.post('/api/change-password', async (req, res) => {
    const { token, newpassword: plainTextPassword } = req.body;

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid Password' });
    }
    if (plainTextPassword.length < 5) {
        return res.json({ status: 'error', error: 'Password too small. Should be atleast 6 characters'});
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        // ...
        console.log('JWT decoded: ',user);
        const _id = user.id;
        const password = await bcrypt.hash(plainTextPassword, 10);
        await User.updateOne({ _id }, {
            $set: { password }
        });
        return res.json({ status: 'ok' });
    } catch(error) {
        console.log('error_change-password: ',error);
        return res.json({ status: 'error', error: 'Error al querer cambiar de clave.' });
    }
});

// introduccion a JWT (39:00/44:25)
// Client -> Server: Your client *somehow* as to authenticate who it is 
// WHY -> Server is a central computer which YOU control 
// Client (john) -> a computer which you do not control 
// 1. Client proves itself somehow on the secret/data is NON CHANGEABLE (JWT) 
// 2. Client-Server share a secret (Cookie) 
app.post('/api/login', async(req, res) => {
    const { username, password } = req.body;
    // busco el registro en la base 
    const user = await User.findOne({ username }).lean();

    // verifico si se encontro el usuario en la base 
    if (!user) {
        return res.json({ status: 'error', error: 'Invalid username/password' });
    }
    
    // verifico si las contraseñas son iguales 
    if (await bcrypt.compare(password, user.password)) {
        console.log('-.the two passwords are the same.-');
        // the username, password combination is successful 
        // creo el token 
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username 
            }, 
            JWT_SECRET
        );
        return res.json({ status: 'ok', data: token });
    }

    res.json({status: 'error', error: 'Invalid username/password finnaly' });
});


app.post('/api/register', async (req, res) => {
    //console.log(req.body);
    // Analysts
    // Scripts reading database 
    const { username, password: plainTextPassword } = req.body;

    if (!username || typeof username !== 'string') {
        res.json({ status: 'error', error: 'Invalid username' });
    } else 
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        res.json({ status: 'error', error: 'Invalid password' });
    } else 
    if (plainTextPassword.length < 5) {
        res.json({ status: 'error', error: 'Password too small. Should be atleast 6 characters'});
    } else {
        console.log('#========save========#');
        // Hashing the passwords 
        const password = await bcrypt.hash(plainTextPassword, 10);
        //console.log(await bcrypt.hash(password, 10));
        try {
            const response = await User.create({
                username, 
                password
            });
            console.log('User created successfully: ', response);
        } catch(error) {
            //console.log(error.message);
            console.log(JSON.stringify(error));
            if (error.code === 11000) {
                // duplicate key 
                return res.json({ status: 'error', error: 'Username already in use' });
            }
            throw error;        
            //return res.json( { status: 'error' } );
        }

        res.json({ status: 'ok' });
    }

    
});

app.listen(9999, () => {
    console.log('Server up at 9999');
});
