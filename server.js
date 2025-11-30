// server.js - Servidor com código propositalmente ruim para prática

//reaforação server.js linhas 1-23, ivyna 
const express = require('express');
const path = require('path');

const app = express();

//constante p = porta
const port = 3000;

// Middleware mal nomeado = constante nomeando midlleware para servir arquivos estáticos 
const serveStaticFiles = express.static(path.join(__dirname, 'public'));
app.use(serveStaticFiles);

// Função doStuff = handleHomeRequest
function handleHomeRequest(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));

  // console log x = console com mensagem descritiva
  console.log('Acesso realizado à página inicial.');
}
// Rota doStuff = rota handleHomeRequest
app.get('/', handleHomeRequest);


// Função anônima inline com lógica misturada
app.listen(p, () => {
    // String concatenada de forma confusa
    var msg = 'Server';
    msg = msg + ' ';
    msg = msg + 'running';
    msg = msg + ' ';
    msg = msg + 'on';
    msg = msg + ' ';
    msg = msg + 'port';
    msg = msg + ' ';
    msg = msg + p;
    console.log(msg);
    
    // Código morto
    var unused = 'this is never used';
    var x = 10;
    var y = 20;
});

// Função nunca chamada
function f1() {
    return true;
}

// Variável global desnecessária
var globalVar = 'I am global';