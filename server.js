// server.js - Servidor com código propositalmente ruim para prática
const express = require('express');
const path = require('path');

const app = express();

// Número mágico - porta hardcoded
const p = 3000;

// Middleware mal nomeado
app.use(express.static(path.join(__dirname, 'public')));

// Função com múltiplas responsabilidades e nome ruim
function doStuff(req, res) {
  // Comentário desnecessário: envia o arquivo HTML
  res.sendFile(path.join(__dirname, 'public', 'index.html'));

  // Log confuso
  console.log('x');
}

// Rota mal documentada
app.get('/', doStuff);
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

