const express = require("express");
const cors = require('cors');
const { verificaExiteciaDeConta, criarContaFrontend, adicionarRegistro, editarRegistro, deletaRegistro, busca_transferencias, editar_perfir_Registro, aplicarFitros,geraGrafico } = require('./controladoresParaFrontend/control');
const app = express();

app.use(express.json());
app.use(cors());



// App do Frontend....
app.get('/transacoes', busca_transferencias);
app.post("/", verificaExiteciaDeConta);
app.post("/cadastrar", criarContaFrontend);
app.post("/adicionar", adicionarRegistro)
app.patch("/editar", editarRegistro);
app.delete("/deletar", deletaRegistro);
app.patch('/editarPerfil', editar_perfir_Registro);
app.post('/filtros', aplicarFitros);
app.get("/gerarGrafico", geraGrafico);

module.exports = app;
