const express = require('express');
const app = express();
const port = 3000;
var path = require('path');

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    const mail = req.query.mail;
    const pwd = req.query.pwd;
    console.log('mail :', mail, '\npwd :', pwd);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});