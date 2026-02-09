const express = require('express');
const MongoStore = require('connect-mongo');
require('dotenv').config({ path: './.env' });
const session = require('express-session');
const app = express();

const port = process.env.PORT || 4000;
const cors = require('cors');
const db = require('./db/conn');

// routes

app.use(cors(
    {
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        optionsSuccessStatus: 204,
        allowedHeaders: ["Content-Type", "Authorization"],
    }
));
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     saveUninitialized: false,
//     resave: false,
//     store: MongoStore.create({
//         mongoUrl: process.env.ATLAS_URI
//     })
// }));

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    db.connectToServer(function (err) {
        if (err) console.log(err);
    });
    console.log(`SkyOps app listening on port ${port}`);
});