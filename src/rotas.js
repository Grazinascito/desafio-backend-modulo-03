const express = require('express');
const usuario = require('./controladores/usuarios');
const produtos = require('./controladores/produtos');
const verifica_login = require('./filtros/verica_token');

const rotas = express();

//cadastro usuario
rotas.post('/usuario', usuario.cadastroUsuario);
rotas.post('/login', usuario.loginUsuario);

//validação do token
rotas.use(verifica_login);

//info-atualização do usuario
rotas.get('/usuario', usuario.infoUsuario);
rotas.put('/usuario', usuario.atualizarUsuario);

//produtos do usuario
rotas.get('/produtos', produtos.listarProdutos);
rotas.get('/produtos/:id', produtos.obterProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.put('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.deletarProduto);

module.exports = rotas;