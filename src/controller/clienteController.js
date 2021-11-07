import db from '../db.js'

import crypto from 'crypto-js'

import  Sequelize  from 'sequelize';
const { Op, col, fn } = Sequelize;

import express from 'express'
const Router = express.Router
const app = Router();

app.get('/', async (req, resp) => {
    try {
        let r = await db.infod_ssc_cliente.findAll({
            attributes: [
                ['id_cliente', 'id'],
                ['id_endereco', 'Endereco'],
                ['nm_cliente', 'Nome do cliente'],
                ['ds_cpf', 'CPF'],
                ['dt_nascimento', 'Data de nascimento'],
                ['nr_telefone', 'Número de telefone'],
                ['ds_email', 'Email'],
                ['ds_codigo', 'Codigo'],
                ['ds_senha', 'Senha']
            ]
        });
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/', async (req, resp) => {
    try {
        
        let { id_do_endereco, nome_cliente, cpf, dtnascimento, telefone, email, senha } = req.body;

        let b = await db.infod_ssc_cliente.create({
            id_endereco: id_do_endereco,
            nm_cliente: nome_cliente,
            ds_cpf: cpf,
            dt_nascimento: dtnascimento,
            nr_telefone: telefone,
            ds_email: email,
            ds_senha: crypto.SHA256(senha).toString(crypto.enc.Base64)
        })
        resp.send(b);
    
} catch(b) {
    resp.send({ erro: b.toString() })
}
})

app.put('/:id', async (req, resp) => {
    try{
        let {  endereco, nome_cliente, cpf, dtnascimento, telefone, email, senha } = req.body;
        let { id } = req.params;

        let b = await db.infod_ssc_cliente.update(
            {
                id_endereco: endereco,
                nm_cliente: nome_cliente,
                ds_cpf: cpf,
                dt_nascimento: dtnascimento,
                nr_telefone: telefone,
                ds_email: email,
                ds_senha: senha

            },
            {
                where: { id_cliente: id }
            }
        )
        resp.sendStatus(200);
    } catch(b) {
        resp.send({ erro: b.toString() })
    }
})  

app.delete('/:id', async (req, resp) => {
    try {
        let { id } = req.params;
        let r = await db.infod_ssc_cliente.destroy({ where: { id_cliente: id } })
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/login', async (req, resp) => {
    try {
        let { email, senha } = req.body;
        let cryptoSenha = crypto.SHA256(senha).toString(crypto.enc.Base64);
        

        let r = await db.infod_ssc_cliente.findOne(
            {
                where: {
                    ds_email: email,
                    ds_senha: cryptoSenha
                },
                raw: true
            }
        )

        if (email === "" || senha === "") {
            return resp.send({ erro: 'Preencha todos os campos!' });
        }

        if (!r) {
            return resp.send({ erro: 'Credenciais inválidas.' })
        }
    
        delete r.ds_senha;
        resp.send(r);
        
    } catch(b) {
        resp.send({ erro: b.toString() })
    }
})

app.post('/cadastro', async (req, resp) => {
    try {
        
        let  { nome, email, senha } = req.body;

        let cryptoSenha = crypto.SHA256(senha).toString(crypto.enc.Base64);

        if (nome === "" || email === "" || senha === "") {
            return resp.send({ erro: 'Preencha todos os campos!' });
        }

        if (!email.includes('@')) {
            return resp.send({ erro: 'Insira um email válido'})
        }
        

        let b = await db.infod_ssc_cliente.create({
            nm_cliente: nome,
            ds_email: email,
            ds_senha: cryptoSenha
        })

        resp.send(b);
    
    } catch(b) {
        resp.send({ erro: b.toString() })
    }
})





app.post('/confi_pagamento', async (req, resp ) => {
    try {
        
        const { endereco, numero, complemento, cliente} = req.body;
        const { cpf, nascimento, telefone } = cliente;

        const user = await db.infod_ssc_cliente.findOne({
            where: {
                ds_email: req.body.email
            }
        }); 
         const EnderecoCliente = await db.infod_ssc_endereco.update({
              ds_endereco: endereco,
              nr_endereco: numero,
              ds_complemento: complemento 
         },{
            where: {
                id_endereco: user.id_endereco
            }
         })
                    

         const confirmacao = await db.infod_ssc_cliente.update({
            id_endereco: EnderecoCliente.id_endereco, 
            ds_cpf: cpf,
            dt_nascimento: nascimento,
            nr_telefone:telefone
         },{
            where: {
                id_cliente: user.id_cliente
            }
         });

        resp.send(confirmacao);

    } catch (b) {
        resp.send({ erro: b.toString() })
    }
})

export default app;