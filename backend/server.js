// On charge les modules dont nous aurons besoin
const express = require('express');                 //pour appli
const bodyParser = require('body-parser');          //pour récup params POST
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const mongo = require('mongodb');
const sha1 = require('sha1');                       //pour hasher mot de passe
const pgClient = require('pg');                      //middleware pgsql
const cors = require('cors');


// On instancie l'application express et 
// on définit le numéro de port sur lequel écouter
const app = express();
const port = 3037;
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

// Permet de lire les query strings (GET) en utilisant 'req.query.xxx'
app.use(bodyParser.urlencoded({ extended: false }));

// Permet de lire les paramètre POST en utilisant 'req.body.xxxx'
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

// Permet de changer le statut de connexion d'un utilisateur
function changeStatus(idDb, status) {
    const sqlReq = "update fredouil.users set statut_connexion=" + 
            status + "where id=" + idDb + ";";
    // var pool = new pgClient.Pool({user: 'uapv1903668', host: '127.0.0.1', database: 'etd', 
    //         password: 'depolX', port: 5432});
    var pool = new pgClient.Pool({user: 'motyak', host: '127.0.0.1', database: 'etd', 
    password: 'passe', port: 5432});
    pool.connect((err, client) => {
        if(err)
            console.log('Erreur connexion au serv pg ' + err.stack);
        else {
            client.query(sqlReq, (err, result) => {
                if(err)
                    console.log('err execution requete sql ' + err.stack);
            })
            client.release();
        }
    });
}

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
                    user["idDb"] = result.rows[0].id;
                    user["profile"] = {
                        "nom": result.rows[0].nom,
                        "prenom": result.rows[0].prenom,
                        "date_naissance": result.rows[0].date_naissance,
                        "avatar": result.rows[0].avatar,
                        "humeur": result.rows[0].humeur,
                        "statut_connexion": result.rows[0].statut_connexion
                    };
                    data["user"] = user;
                    // changement du statut de connexion
                    changeStatus(result.rows[0].id, "1");
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

// route pour logout
app.post('/logout', (req, res) => {
    // changement du statut de connexion
    changeStatus(req.body.idDb, "0");
    req.session.destroy();
    console.log('session destroyed');
    res.send();
});

// Route pour ajouter une partie à l'historique
app.post('/histo', (req, res) => {
    // récupération des données POST
    const id_user = req.body.id_user;
    const date_jeu = req.body.date_jeu;
    const niveau_jeu = req.body.niveau_jeu;
    const nb_reponses_corr = req.body.nb_reponses_corr;
    const temps = req.body.temps;
    const score = req.body.score;

    // ajout de la partie dans la base de données
    const sqlReq = "insert into fredouil.historique" + 
        "(id_user,date_jeu,niveau_jeu,nb_reponses_corr,temps,score) " + 
        "values(" + id_user + ",'" + date_jeu + "'," + niveau_jeu + "," + 
        nb_reponses_corr + "," + temps + "," + score + ");";

    // var pool = new pgClient.Pool({user: 'uapv1903668', host: '127.0.0.1', database: 'etd', 
    //         password: 'depolX', port: 5432});
    var pool = new pgClient.Pool({user: 'motyak', host: '127.0.0.1', database: 'etd', 
            password: 'passe', port: 5432});
    pool.connect((err, client) => {
        if(err)
            console.log('Erreur connexion au serv pg ' + err.stack);
        else {
            client.query(sqlReq, (err, result) => {
                if(err)
                    console.log('err execution requete sql ' + err.stack);
                else
                    console.log('sql insert histo success');
            })
            client.release();
        }
    });
});

// Route pour ajouter un défi à l'historique
app.post('/defi', (req, res) => {
    // récupération des données POST
    const id_user_gagnant = req.body.id_user_gagnant;
    const id_user_perdant = req.body.id_user_perdant;
    const date_defi = req.body.date_defi;

    // ajout du défi dans la base de données
    const sqlReq = "insert into fredouil.hist_defi(id_user_gagnant,id_user_perdant,date_defi) values (" +
            id_user_gagnant + "," + id_user_perdant + ",'" + date_defi + "');";

    // var pool = new pgClient.Pool({user: 'uapv1903668', host: '127.0.0.1', database: 'etd', 
    //         password: 'depolX', port: 5432});
    var pool = new pgClient.Pool({user: 'motyak', host: '127.0.0.1', database: 'etd', 
            password: 'passe', port: 5432});
    pool.connect((err, client) => {
        if(err)
            console.log('Erreur connexion au serv pg ' + err.stack);
        else {
            client.query(sqlReq, (err, result) => {
                if(err)
                    console.log('err execution requete sql ' + err.stack);
                else
                    console.log('sql insert hist_defi success');
            })
            client.release();
        }
    });
});

// route pour récupérer les thèmes de quiz disponibles
app.get('/themes', (req, res) => {

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

// route pour récupérer 10 questions selon un thème
app.post('/quiz', (req, res) => {

    const theme = req.body.theme;

    var MongoClient = mongo.MongoClient;

    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
      if (err) throw err;
      var db = client.db('db');
      
      const pipeline = [
        {'$match': {'thème': theme}}, 
        {'$project': {'quizz': 1}},
        {'$unwind': '$quizz'},
        {'$sample': {'size': 10}}
      ];

      db.collection('quiz').aggregate(pipeline).toArray((err, result) => {
        if (err) throw err;
        res.json(result);
      });


    });
});

// route pour récupérer le nb de médailles d'un joueur
app.get('/medals', (req, res) => {
    const idDb = req.query.idDb;

    const sqlReq = "select count(id) from fredouil.hist_defi where id_user_gagnant=" + idDb + ";";
    // var pool = new pgClient.Pool({user: 'uapv1903668', host: '127.0.0.1', database: 'etd', 
    //         password: 'depolX', port: 5432});
    var pool = new pgClient.Pool({user: 'motyak', host: '127.0.0.1', database: 'etd', 
            password: 'passe', port: 5432});
    pool.connect((err, client) => {
        if(err)
            console.log('Erreur connexion au serv pg ' + err.stack);
        else {
            client.query(sqlReq, (err, result) => {
                if(err) {
                    // envoi des données
                    res.json();
                    console.log('err execution requete sql ' + err.stack);
                }
                else {
                    // envoi des données
                    res.json(result.rows);
                }
            })
            client.release();
        }
    });
});

// route pour récupérer l'historique de parties solo
app.get('/histo', (req, res) => {

    const idDb = req.query.idDb;

    // récupération des 10 dernières parties du joueur
    const sqlReqSolo = "select * from fredouil.historique where id_user=" 
        + idDb + " order by date_jeu desc limit 10;"
    // var pool = new pgClient.Pool({user: 'uapv1903668', host: '127.0.0.1', database: 'etd', 
    //         password: 'depolX', port: 5432});
    var pool = new pgClient.Pool({user: 'motyak', host: '127.0.0.1', database: 'etd', 
            password: 'passe', port: 5432});
    pool.connect((err, client) => {
        if(err)
            console.log('Erreur connexion au serv pg ' + err.stack);
        else {
            client.query(sqlReqSolo, (err, result) => {
                if(err) {
                    // envoi des données
                    res.json();
                    console.log('err execution requete sql ' + err.stack);
                }
                else {
                    // envoi des données
                    res.json(result.rows);
                }
            })
            client.release();
        }
    });
});

// route pour récupérer le classement des meilleurs scores
app.get('/topten', (req, res) => {
    const sqlReq = 
        "select u.identifiant,score " +
        "from fredouil.historique " +
        "join fredouil.users u on fredouil.historique.id_user=u.id " +
        "order by score desc " +
        "limit 10;"; 
    // var pool = new pgClient.Pool({user: 'uapv1903668', host: '127.0.0.1', database: 'etd', 
    //         password: 'depolX', port: 5432});
    var pool = new pgClient.Pool({user: 'motyak', host: '127.0.0.1', database: 'etd', 
        password: 'passe', port: 5432});
    pool.connect((err, client) => {
      if(err)
          console.log('Erreur connexion au serv pg ' + err.stack);
      else {
          client.query(sqlReq, (err, result) => {
              if(err) {
                  // envoi des données
                  res.json();
                  console.log('err execution requete sql ' + err.stack);
              }
              else {
                  // envoi des données
                  res.json(result.rows);
              }
          })
          client.release();
      }
    });
  });

// route pour récupérer l'historique de défis
app.get('/defis', (req, res) => {
  const idDb = req.query.idDb;
  const sqlReqDefis = 
      "select u1.identifiant as gagnant,u2.identifiant as perdant,date_defi " +
      "from fredouil.hist_defi " +
      "join fredouil.users u1 on fredouil.hist_defi.id_user_gagnant=u1.id " +
      "join fredouil.users u2 on fredouil.hist_defi.id_user_perdant=u2.id " +
      "where id_user_gagnant=" + idDb + "or id_user_perdant=" + idDb +
      " order by date_defi desc" +
      " limit 10"; 
  // var pool = new pgClient.Pool({user: 'uapv1903668', host: '127.0.0.1', database: 'etd', 
  //         password: 'depolX', port: 5432});
  var pool = new pgClient.Pool({user: 'motyak', host: '127.0.0.1', database: 'etd', 
      password: 'passe', port: 5432});
  pool.connect((err, client) => {
    if(err)
        console.log('Erreur connexion au serv pg ' + err.stack);
    else {
        client.query(sqlReqDefis, (err, result) => {
            if(err) {
                // envoi des données
                res.json();
                console.log('err execution requete sql ' + err.stack);
            }
            else {
                // envoi des données
                res.json(result.rows);
            }
        })
        client.release();
    }
  });
});

// route pour récupérer la liste des joueurs connectés
app.get('/players', (req, res) => {

    const idDb = req.query.idDb;

    const sqlReq = "select id,identifiant from fredouil.users where id<>" 
        + idDb + " and statut_connexion=1 order by identifiant asc limit 50;"
    // var pool = new pgClient.Pool({user: 'uapv1903668', host: '127.0.0.1', database: 'etd', 
    //         password: 'depolX', port: 5432});
    var pool = new pgClient.Pool({user: 'motyak', host: '127.0.0.1', database: 'etd', 
            password: 'passe', port: 5432});
    pool.connect((err, client) => {
        if(err)
            console.log('Erreur connexion au serv pg ' + err.stack);
        else {
            client.query(sqlReq, (err, result) => {
                if(err) {
                    // envoi des données
                    res.json();
                    console.log('err execution requete sql ' + err.stack);
                }
                else {
                    // envoi des données
                    res.json(result.rows);
                }
            })
            client.release();
        }
    });
});

// Route pour récupérer un défi temporaire
app.get('/defiTmp', (req, res) => {
    var MongoClient = mongo.MongoClient;

    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
		if (err) throw err;
		var db = client.db('db');
      
		db.collection('defi').findOne({"idUserDefiant": parseInt(req.query.idUserDefiant), "idUserDefie": parseInt(req.query.idUserDefie)}, (err, result) => {
			if (err) throw err;
			res.json(result);
		});
    });
});

// Route pour sauvegarder un défi (temporairement)
app.post('/defiTmp', (req, res) => {
    var MongoClient = mongo.MongoClient;

    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
		if (err) throw err;
		var db = client.db('db');
      
		db.collection('defi').insertOne(req.body, (err, result) => {
			if (err) throw err;
			res.send();
		});
    });
});

// Route pour supprimer défi temporaire
app.delete('/defi', (req, res) => {
    var MongoClient = mongo.MongoClient;

    MongoClient.connect('mongodb://localhost:27017', (err, client) => {
		if (err) throw err;
		var db = client.db('db');
      
        db.collection('defi').deleteMany({"idUserDefiant": req.body.idUserDefiant, "idUserDefie": req.body.idUserDefie}, (err, result) => {
            if (err) throw err;
			res.send();
        });
    });
});

/* GESTION WEBSOCKETS */
let users = new Map();
// gestion de la connexion et des messages reçus de la part d'un client
io.on('connection', socketClient => {
    socketClient.on('login', data => {
        console.log('L\'utilisateur ' + data + ' vient de se connecter!');
        socketClient.broadcast.emit('notification', 'L\'utilisateur ' + data + ' vient de se connecter !');
    });

    socketClient.on('id', data => {
        users.set(data, socketClient.id);
        console.log(users);
        // renvoyer au client la liste des sockets connectés
        socketClient.emit('ids', users);
        socketClient.broadcast.emit('ids', users);
    });

    socketClient.on('defi', data => {
        /* Ajouter l'identifiantDefiant à data */
        const sqlReq = "select identifiant from fredouil.users where id=" + data.idUserDefiant;
        // var pool = new pgClient.Pool({user: 'uapv1903668', host: '127.0.0.1', database: 'etd', 
        //         password: 'depolX', port: 5432});
        var pool = new pgClient.Pool({user: 'motyak', host: '127.0.0.1', database: 'etd', 
                password: 'passe', port: 5432});
        pool.connect((err, client) => {
            if(err) console.log('Erreur connexion au serv pg ' + err.stack);
            else {
                client.query(sqlReq, (err, result) => {
                    if(err) console.log('err execution requete sql ' + err.stack);
                    else {
                        data['identifiantDefiant'] = result.rows[0].identifiant;
                        socketClient.to(users.get(data.idUserDefie)).emit('defi', data);
                    }
                })
                client.release();
            }
        });

        
    })

    socketClient.on('logout', data => {
        console.log('L\'utilisateur ' + data.username + ' s\'est déconnecté');
        users.delete(data.idDb);
        console.log(users);
        socketClient.broadcast.emit('notification', 'L\'utilisateur ' + data.username + ' s\'est déconnecté');
    });
});

// On lance le serveur node sous le port assigné, qui va traiter
// chaque requête HTTP qui lui sera destinée (GET, POST, ..)
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});





