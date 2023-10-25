const express = require("express");

const { listaContas, criarConta, usuario2, atualizarUsuarioConta, excluirConta, depositar, sacar, tranferir, saldo, extrato } = require('./controladoParaBackend/control2');
const app = express();

app.use(express.json());

// App do backend...
app.get('/contas', listaContas);
app.post('/contas', criarConta);
app.put('/contas/:numeroConta/usuario', atualizarUsuarioConta);
app.delete('/contas/:numeroConta', excluirConta);
app.post('/transacoes/depositar', depositar);
app.post('/transacoes/sacar', sacar);
app.post('/transacoes/transferir', tranferir);
app.get('/contas/saldo', saldo);
app.get('/contas/extrato', extrato);



module.exports = app;
