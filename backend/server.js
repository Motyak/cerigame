// On charge les modules dont nous aurons besoin
const express = require('express');                 //pour appli
const bodyParser = require('body-parser');          //pour récup params POST
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');                       //pour chemin statique des res
const sha1 = require('sha1');                       //pour hasher mot de passe
const pgClient = require('pg');                      //middleware pgsql
const { request } = require('http');
const { release } = require('os');
const cors = require('cors');


// On instancie l'application express et 
// on définit le numéro de port sur lequel écouté
const app = express();
const port = 3037;

// On créé un accès statique aux ressources du répertoire
// dans lequel se trouve les fichiers du site (html, css, ..)
// app.use(express.static("../frontend/dist/frontend"));

// // Permet de lire les paramètre POST en utilisant 'req.body.xxxx'
app.use(bodyParser.json());

// enable all cors requests
app.use(cors())

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

// Charge la page index lorsqu'un utilisateur accède à la racine
// du site
// app.get('/', (req, res) => {
//     res.sendFile('index.html');
// });

// Route permettant d'authentifier un utilisateur
// app.post('/login', sessionChecker, (req, res) => {
app.post('/login', (req, res) => {
    // récupération des données POST
    const mail = req.body.mail;
    const pwd = req.body.pwd;
    console.log(mail+":"+pwd);
    
    var authSuccess = false;

    // vérifier les identifiants dans bdd...
    const sqlReq = "select * from fredouil.users where identifiant='" + mail +
            "' and motpasse='" + pwd + "' limit 1;";
    var pool = new pgClient.Pool({user: 'uapv1903668', host: '127.0.0.1', database: 'etd', 
            password: 'depolX', port: 5432});
    pool.connect((err, client, done) => {
        if(err)
            console.log('Erreur connexion au serv pg ' + err.stack);
        else {
            client.query(sqlReq, (err, result) => {
                if(err)
                    console.log('err execution requete sql ' + err.stack);
                else if((result.rows[0] != null) && (result.rows[0].password == pwd))
                    authSuccess = true;
                release();
            })
        }
    });

    var data = {};

    // si paramètre reçus correct..
    if(authSuccess) {
        // ouverture session
        req.session.isConnected = true;
        req.session.user = mail;
        console.log(req.session.id + ' expire dans ' + 
            req.session.cookie.maxAge + ' s');

        // on retourne les infos de l'utilisateur
        var user = {};
        user["name"] = mail; user["currentLogin"] = new Date();
        data["auth"] = true; data["user"] = user;

        console.log('mail :', mail, '\npwd :', pwd);
    }
    else {
        data["auth"] = false;
    }
    // on renvoie les données en JSON
    res.json(data);
});

app.post('/logout', (req, res) => {
    req.session.destroy();
    console.log('session destroyed');
    res.send();
});

// On lance le serveur node sous le port assigné, qui va traiter
// chaque requête HTTP qui lui sera destinée (GET, POST, ..)
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
