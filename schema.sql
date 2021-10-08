CREATE DATABASE market_cubos;

CREATE TABLE IF NOT EXISTS usuarios(
	id SERIAL NOT NULL PRIMARY KEY,
   	nome TEXT NOT NULL,
  	nome_loja TEXT NOT NULL,
  	email TEXT NOT NULL UNIQUE,
  	senha TEXT NOT NULL

);

CREATE TABLE IF NOT EXISTS produtos(
	id SERIAL NOT NULL PRIMARY KEY,
  	usuario_id INTEGER NOT NULL,
  	nome TEXT NOT NULL,
  	quantidade INTEGER NOT NULL,
  	categoria TEXT NOT NULL,
  	preco INTEGER NOT NULL,
  	descricao TEXT,
  	imagem TEXT
);
