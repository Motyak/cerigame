// On charge les modules dont nous aurons besoin
const express = require('express');                 //pour appli
const bodyParser = require('body-parser');          //pour récup params POST
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');                       //pour chemin statique des res

// On instancie l'application express et 
// on définit le numéro de port sur lequel écouté
const app = express();
const port = 3037;

// On créé un accès statique aux ressources du répertoire
// dans lequel se trouve les fichiers du site (html, css, ..)
app.use(express.static("../frontend/dist/frontend"));

// Permet de lire les paramètre POST en utilisant 'req.body.xxxx'
app.use(bodyParser.urlencoded({ extended: true }));

// Récupération des données de session (stockées dans bdd MongoDB)
app.use(session({
    secret: 'onsenfout',
    saveUninitialized: false,
    resave: false,
    store: new mongoDBStore({
        uri: 'mongodb://127.0.0.1:27017',
        collection: 'sessions',
        touchAfter: 24 * 3600
    }),
    cookie: {maxAge: 24 * 3600 * 1000}
}));

// var sessionChecker = (req, res, next) => {
//     if (req.session.user)
//         res.redirect('/test');
//     else
//         next();
// };

// Charge la page index lorsqu'un utilisateur accède à la racine
// du site
// app.get('/', sessionChecker, (req, res) => {
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

// Route permettant d'authentifier un utilisateur
// app.post('/login', sessionChecker, (req, res) => {
app.post('/login', (req, res) => {
    // récupération des données POST
    const mail = req.body.mail;
    const pwd = req.body.pwd;

    // vérifier les identifiants dans bdd...

    // si paramètre reçus correct..
    if(true) {
        // // ouverture session
        // req.session.isConnected = true;
        // req.session.user = mail;
        // console.log(req.session.id + ' expire dans ' + 
        //     req.session.cookie.maxAge + ' s');

        // on retourne les infos de l'utilisateur
        var user = {};
        var data = {};
        user["name"] = "Motyak"; user["currentLogin"] = new Date();
        data["auth"] = true; data["user"] = user;
        res.json(data);
        
        console.log('mail :', mail, '\npwd :', pwd);
    }

    
});

// On lance le serveur node sous le port assigné, qui va traiter
// chaque requête HTTP qui lui sera destinée (GET, POST, ..)
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
