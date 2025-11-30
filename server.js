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


// Inicia o servidor 
app.listen(port, () => {
    // Console log corrigido com template string
    console.log(`Server running on port ${port}`);
});
