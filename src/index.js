import db from './db.js';
import express from 'express'
import cors from 'cors'
import axios from 'axios'

import enviarEmail from './email.js';

const app = express();
app.use(cors());
app.use(express.json());

// Recuperaçao de senha

app.post('/BemVindo', async (req,resp) =>{
    
})



// Recuperaçao de senha


app.get('/produto', async (req, resp) => {
    try {
        let r = await db.infod_ssc_produto.findAll( );
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/produto', async (req, resp) => {
    try {
        
        let { nome, preco, categoria, descricao, avaliacao, imagem } = req.body;

        let b = await db.infod_ssc_produto.create({
            nm_produto: nome,
            vl_produto: preco,
            nm_categoria: categoria,
            ds_produto: descricao,
            ds_avaliacao: avaliacao,
            ds_imagem: imagem
        })
        resp.send(b);
    
} catch(b) {
    resp.send({ erro: b.toString() })
}
})

app.delete('/produto/:id', async (req, resp) => {
    try {
        let { id } = req.params;
        let r = await db.infod_ssc_produto.destroy({ where: { id_produto: id } })
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.put('/produto/:id', async (req, resp) => {
    try{
        let { nome, preco, categoria, descricao, avaliacao, imagem } = req.body;
        let { id } = req.params;

        let b = await db.infod_ssc_produto.update(
            {
                nm_produto: nome,
                vl_produto: preco,
                nm_categoria: categoria,
                ds_produto: descricao,
                ds_avaliacao: avaliacao,
                ds_imagem: imagem
            },
            {
                where: { id_produto: id }
            }
        )
        resp.sendStatus(200);
    } catch(b) {
        resp.send({ erro: b.toString() })
    }
})

// Produto

app.get('/estoque', async (req, resp) => {
    try {
        let r = await db.infod_ssc_estoque.findAll( );
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/estoque', async (req, resp) => {
    try {
        
        let { produto, disponivel} = req.body;
        let c = await db.infod_ssc_estoque.create(
         {
            
            id_produto: produto,
            qtd_disponivel: disponivel
        
         })

        resp.send(c);
    
    } catch(c) {
    resp.send({ erro: c.toString() })
    }
})

app.put('/estoque/:id', async (req, resp) => {
    try{
        let {  produto, disponivel} = req.body;
        let { id } = req.params;

        let b = await db.infod_ssc_estoque.update(
            {
                id_produto: produto,
                qtd_disponivel: disponivel
            },
            {
                where: { id_estoque: id }
            }
        )
        resp.sendStatus(200);
    } catch(b) {
        resp.send({ erro: b.toString() })
    }
})  

app.delete('/estoque/:id', async (req, resp) => {
    try {
        let { id } = req.params;
        let r = await db.infod_ssc_estoque.destroy({ where: { id_estoque: id } })
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})
// Estoque

app.get('/cliente', async (req, resp) => {
    try {
        let r = await db.infod_ssc_cliente.findAll( );
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/cliente', async (req, resp) => {
    try {
        
        let { endereco, nome_cliente, cpf, dtnascimento, telefone, email, senha } = req.body;

        let b = await db.infod_ssc_cliente.create({
            id_endereco: endereco,
            nm_cliente: nome_cliente,
            ds_cpf: cpf,
            dt_nascimento: dtnascimento,
            nr_telefone: telefone,
            ds_email: email,
            ds_senha: senha
        })
        resp.send(b);
    
} catch(b) {
    resp.send({ erro: b.toString() })
}
})

app.put('/cliente/:id', async (req, resp) => {
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

app.delete('/cliente/:id', async (req, resp) => {
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

        let r = await db.infod_ssc_cliente.findOne(
            {
                where: {
                    ds_email: email,
                    ds_senha: senha
                },
                raw: true
            }
        )

        if (r === null) {
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

        let b = await db.infod_ssc_cliente.create({
            nm_cliente: nome,
            ds_email: email,
            ds_senha: senha
        })

        if (nome === "" && email === "" && senha === "") {
            return resp.send({ erro: 'Preencha todos os campos!' });
        }
        resp.send(b);
    
} catch(b) {
    resp.send({ erro: b.toString() })
}
})
// Cliente

app.get('/endereco', async (req, resp) => {
    try {
        let r = await db.infod_ssc_endereco.findAll( );
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/endereco', async (req, resp) => {
    try {
        
        let { endereco, numero_do_endereco, descricao_do_cep, nome_cidade, complemento } = req.body;

        let j = await db.infod_ssc_endereco.create({
            ds_endereco: endereco,
            nr_endereco: numero_do_endereco,
            ds_cep: descricao_do_cep,
            nm_cidade: nome_cidade,
            ds_complemeno: complemento
        })
        resp.send(j);
    
} catch(j) {
    resp.send({ erro: j.toString() })
}
})

app.put('/endereco/:id', async (req, resp) => {
    try{
        let {  endereco, numero_do_endereco, descricao_do_cep, nome_cidade, complemento } = req.body;
        let { id } = req.params;

        let b = await db.infod_ssc_endereco.update(
            {
                ds_endereco: endereco,
                nr_endereco: numero_do_endereco,
                ds_cep: descricao_do_cep,
                nm_cidade: nome_cidade,
                ds_complemeno: complemento
                
            },
            {
                where: { id_endereco: id }
            }
        )
        resp.sendStatus(200);
    } catch(b) {
        resp.send({ erro: b.toString() })
    }
})  

app.delete('/endereco/:id', async (req, resp) => {
    try {
        let { id } = req.params;
        let r = await db.infod_ssc_endereco.destroy({ where: { id_endereco: id } })
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})
// Endereco

app.get('/item_venda', async (req, resp) => {
    try {
        let r = await db.infod_ssc_item_venda.findAll( );
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/item_venda', async (req, resp) => {
    try {
        
        let { id_do_produto, id_da_venda } = req.body;

        let j = await db.infod_ssc_item_venda.create({

            id_produto: id_do_produto,
            id_venda: id_da_venda

        })
        resp.send(j);
    
    } catch(j) {
    resp.send({ erro: j.toString() })
    }
})

app.delete('/item_venda/:id', async (req, resp) => {
    try {
        let { id } = req.params;
        let r = await db.infod_ssc_item_venda.destroy({ where: { id_item_venda: id } })
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.put('/item_venda/:id', async (req, resp) => {
    try{
        let {  id_do_produto, id_da_venda } = req.body;
        let { id } = req.params;

        let b = await db.infod_ssc_item_venda.update(
            {
                id_produto: id_do_produto,
                id_venda: id_da_venda
                
            },
            {
                where: { id_item_venda: id }
            }
        )
        resp.sendStatus(200);
    } catch(b) {
        resp.send({ erro: b.toString() })
    }
})  

// Item_venda

app.get('/venda', async (req, resp) => {
    try {
        let r = await db.infod_ssc_venda.findAll( );
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/venda', async (req, resp) => {
    try {
        
        let { id_cliente, id_endereco_entrega, descricao_da_entrega, descricao_do_frete, nome_do_destinatario, forma_pagamento, data_da_venda, descricao_do_pagamento, numero_do_cartao, quantidade_de_parcelas, descricao_codigo_seguranca } = req.body;

        let j = await db.infod_ssc_venda.create({

            id_cliente: id_cliente,
            id_endereco_entrega: id_endereco_entrega,
            ds_entrega: descricao_da_entrega ,
            ds_frete: descricao_do_frete,
            nm_destinatario: nome_do_destinatario,
            tp_forma_pagamento: forma_pagamento,
            dt_venda: data_da_venda,
            ds_pagamento: descricao_do_pagamento,
            nr_cartao: numero_do_cartao,
            qtd_parcelas: quantidade_de_parcelas,
            ds_codigo_seguranca: descricao_codigo_seguranca

        })
        resp.send(j);
    
} catch(j) {
    resp.send({ erro: j.toString() })
}
})

app.put('/venda/:id', async (req, resp) => {
    try{
        let {  id_cliente, id_endereco_entrega, descricao_da_entrega, descricao_do_frete, nome_do_destinatario, forma_pagamento, data_da_venda, descricao_do_pagamento, numero_do_cartao, quantidade_de_parcelas, descricao_codigo_seguranca } = req.body;
        let { id } = req.params;

        let b = await db.infod_ssc_venda.update(
            {
                
            id_cliente: id_cliente,
            id_endereco_entrega: id_endereco_entrega,
            ds_entrega: descricao_da_entrega ,
            ds_frete: descricao_do_frete,
            nm_destinatario: nome_do_destinatario,
            tp_forma_pagamento: forma_pagamento,
            dt_venda: data_da_venda,
            ds_pagamento: descricao_do_pagamento,
            nr_cartao: numero_do_cartao,
            qtd_parcelas: quantidade_de_parcelas,
            ds_codigo_seguranca: descricao_codigo_seguranca
            
            },
            {
                where: { id_venda: id }
            }
        )
        resp.sendStatus(200);
    } catch(b) {
        resp.send({ erro: b.toString() })
    }
})  

app.delete('/venda/:id', async (req, resp) => {
    try {
        let { id } = req.params;
        let r = await db.infod_ssc_venda.destroy({ where: { id_venda: id } })
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})
// Venda

//email


app.post('/enviar', async (req, resp) => {
    try {

        const response = await
        enviarEmail(req.body.para, req.body.assunto, req.body.mensagem);

        resp.send(response);

    } catch(e) {

        resp.send(e)
    }
})

app.get('/buscarbairro', async (req, resp) => {
    try{
        const api_key = 'b866c3722fa645f9acb1da4674663672';
        const { lat, lon } = req.query;

        let r = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${api_key}`);
        resp.send(r.data);

    } catch(e) {

        resp.send(e);

    }
})

app.listen(process.env.PORT,
            x => console.log(`Subiu lá meu nobre na porta ${process.env.PORT}`))