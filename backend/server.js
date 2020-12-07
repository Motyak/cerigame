// On charge les modules dont nous aurons besoin
const express = require('express');                 //pour appli
const bodyParser = require('body-parser');          //pour récup params POST
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const mongo = require('mongodb');
const path = require('path');                       //pour chemin statique des res
const sha1 = require('sha1');                       //pour hasher mot de passe
const pgClient = require('pg');                      //middleware pgsql
// const { request } = require('http');
const cors = require('cors');


// On instancie l'application express et 
// on définit le numéro de port sur lequel écouté
const app = express();
const port = 3037;

// // Permet de lire les paramètre POST en utilisant 'req.body.xxxx'
app.use(bodyParser.json());

// enable all cors requests
app.use(cors());

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

// Route permettant d'authentifier un utilisateur
app.post('/login', (req, res) => {
    // récupération des données POST
    const identifiant = req.body.identifiant;
    const pwd = req.body.pwd;
    console.log(identifiant+":"+pwd);

    // vérifier les identifiants dans bdd...
    const sqlReq = "select * from fredouil.users where identifiant='" + identifiant +
            "' and motpasse='" + sha1(pwd) + "' limit 1;";
    // var pool = new pgClient.Pool({user: 'uapv1903668', host: '127.0.0.1', database: 'etd', 
    //         password: 'depolX', port: 5432});
    var pool = new pgClient.Pool({user: 'motyak', host: '127.0.0.1', database: 'etd', 
            password: 'passe', port: 5432});
    pool.connect((err, client) => {
        if(err)
            console.log('Erreur connexion au serv pg ' + err.stack);
        else {
            client.query(sqlReq, (err, result) => {
                var data = {};
                if(err) {
                    data["auth"] = false;
                    // envoi des données
                    res.json(data);
                    console.log('err execution requete sql ' + err.stack);
                }
                else if((result.rows[0] != null) && (result.rows[0].motpasse == sha1(pwd))) {
                    // ouverture session
                    req.session.isConnected = true;
                    req.session.user = identifiant;
                    console.log(req.session.id + ' expire dans ' + 
                            req.session.cookie.maxAge + ' s');
                    // recuperation infos utilisateurs
                    var user = {};
                    user["identifiant"] = result.rows[0].identifiant; 
                    user["currentLogin"] = new Date(); data["auth"] = true; 
                    data["user"] = user;
                    // envoi des données
                    res.json(data);
                }
                else {
                    data["auth"] = false;
                    // envoi des données
                    res.json(data);
                }
            })
            client.release();
        }
    });
});

// route pour logout (détruire la session)
app.post('/logout', (req, res) => {
    req.session.destroy();
    console.log('session destroyed');
    res.send();
});

// route pour récupérer les thèmes de quiz disponibles
app.post('/themes', (req, res) => {

    var MongoClient = mongo.MongoClient;

    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
      if (err) throw err;
      var db = client.db('db');
      
        db.collection('quiz').distinct('thème', (err, result) => {
        if (err) throw err;
        res.json(result);
      });
    });
});

// On lance le serveur node sous le port assigné, qui va traiter
// chaque requête HTTP qui lui sera destinée (GET, POST, ..)
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
