// On charge les modules dont nous aurons besoin
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

// On instancie l'application express et 
// on définit le numéro de port sur lequel écouté
const app = express();
const port = 3037;

// On créé un accès statique aux ressources du répertoire 'public'
// dans lequel se trouve les fichiers du site (html, css, ..)
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
    key: 'user_sid',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 24 * 3600  //24h
    }
}));

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/test');
    } else {
        next();
    }
};

// Charge la page index lorsqu'un utilisateur accède à la racine
// du site
app.get('/', sessionChecker, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'indexx.html'));
});

app.post('/login', sessionChecker, (req, res) => {
    // récupération des query strings
    const mail = req.body.mail;
    const pwd = req.body.pwd;

    // ouverture session
    req.session.user = mail;
    console.log(req.session.id + ' expire dans ' + 
        req.session.cookie.maxAge);

    // on redirige vers l'index
    res.sendFile(path.join(__dirname, 'public', 'test.html'));
    
    console.log('mail :', mail, '\npwd :', pwd);
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// On lance le serveur node sous le port assigné, qui va traiter
// chaque requête HTTP qui lui sera destinée (GET, POST, ..)
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
