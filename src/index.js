import db from './db.js';
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import crypto from 'crypto-js'

import enviarEmail from './email.js';

import  Sequelize  from 'sequelize';
const { Op, col, fn } = Sequelize;

const app = express();
app.use(cors());
app.use(express.json());

// Recuperaçao de senha


// app.post('/login', async (req, resp) => {
// const user = await db.insf_tb_usuario.findOne({
//     where: {
//     ds_email: req.body.email,
//     ds_senha: req.body.senha
//     }
// })

// if (!user) {
//     resp.send({ status: 'erro', mensagem: 'Credenciais inválidas.' });
// } else {
//     resp.send({ status: 'ok', nome: user.nm_usuario });
// }

// })


// app.post('/esqueciASenha', async (req, resp) => {
// const user = await db.insf_tb_usuario.findOne({
//     where: {
//     ds_email: req.body.email   
//     }
// });

// if (!user) {
//     resp.send({ status: 'erro', mensagem: 'E-mail inválido.' });
// }

// let code = getRandomInteger(1000, 9999);
// await db.insf_tb_usuario.update({
//     ds_codigo_rec: code
// }, {
//     where: { id_usuario: user.id_usuario }
// })

// enviarEmail(user.ds_email, 'Recuperação de Senha', `
//     <h3> Recuperação de Senha </h3>
//     <p> Você solicitou a recuperação de senha da sua conta. </p>
//     <p> Entre com o código <b>${code}</b> para prosseguir com a recuperação.
// `)

// resp.send({ status: 'ok' });
// })


// app.post('/validarCodigo', async (req, resp) => {
// const user = await db.insf_tb_usuario.findOne({
//     where: {
//     ds_email: req.body.email   
//     }
// });

// if (!user) {
//     resp.send({ status: 'erro', mensagem: 'E-mail inválido.' });
// }

// if (user.ds_codigo_rec !== req.body.codigo) {
//     resp.send({ status: 'erro', mensagem: 'Código inválido.' });
// }

// resp.send({ status: 'ok', mensagem: 'Código validado.' });

// })

// app.put('/resetSenha', async (req, resp) => {
// const user = await db.insf_tb_usuario.findOne({
//     where: {
//     ds_email: req.body.email   
//     }
// });

// if (!user) {
//     resp.send({ status: 'erro', mensagem: 'E-mail inválido.' });
// }


// if (user.ds_codigo_rec !== req.body.codigo ||
//     user.ds_codigo_rec === '') {
//     resp.send({ status: 'erro', mensagem: 'Código inválido.' });
// }

// await db.insf_tb_usuario.update({
//     ds_senha: req.body.novaSenha,
//     ds_codigo_rec: ''
// }, {
//     where: { id_usuario: user.id_usuario }
// })

// resp.send({ status: 'ok', mensagem: 'Senha alterada.' });
// })  


// Recuperaçao de senha



app.get('/adm', async (req, resp) => {
    try {
        let r = await db.infod_ssc_adm.findAll({
            attributes: [
                ['ds_email', 'email'],
                ['ds_senha', 'senha']
            ]
        });
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})


app.post('/adm', async (req, resp) => {
    try {
        
        let { email, senha } = req.body;

        let b = await db.infod_ssc_adm.create({
            ds_email: email,
            ds_senha: senha
        })
        resp.send(b);
    
    } catch(b) {
        resp.send({ erro: b.toString() })
    }
})
// Adm

app.get('/produto', async (req, resp) => {
    try {
        let r = await db.infod_ssc_produto.findAll({
            order: [[ 'id_produto', 'desc' ]],
            attributes: [
                ['id_produto', 'id'],
                ['nm_produto', 'produto'],
                ['vl_produto', 'preco'],
                ['nm_categoria', 'categoria'],
                ['ds_avaliacao', 'avaliacao'],
                ['ds_produto', 'descricao'],
                ['qtd_disponivel_estoque', 'estoque'],
                ['ds_imagem', 'imagem']
            ]
        });
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/produto', async (req, resp) => {
    try {
        
        let { nome, preco, categoria, avaliacao, descricao, estoque, imagem } = req.body;

        if (nome === ''  || preco === ''  || descricao === '' || imagem === '')
            return resp.send({ erro: 'Preencha todos os campos!' })

        let b = await db.infod_ssc_produto.create({
            nm_produto: nome,
            vl_produto: preco,
            nm_categoria: categoria,
            ds_avaliacao: avaliacao,
            ds_produto: descricao,
            qtd_disponivel_estoque: estoque,
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
        let { nome, preco, categoria, avaliacao, descricao, estoque, imagem } = req.body;
        let { id } = req.params;

        let b = await db.infod_ssc_produto.update(
            {
                nm_produto: nome,
                vl_produto: preco,
                nm_categoria: categoria,
                ds_avaliacao: avaliacao,
                ds_produto: descricao,
                qtd_disponivel_estoque: estoque,
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







app.get('/produtos', async (req, resp) => {
    try {
        let produtos;
        if (req.query.categoria) {
            produtos = await db.infod_ssc_produto.findAll({ 
                where: {
                    nm_categoria: req.query.categoria
                },
                order: [[ 'id_produto', 'desc' ]],
                attributes: [
                    ['id_produto', 'id'],
                    ['nm_produto', 'produto'],
                    ['vl_produto', 'preco'],
                    ['nm_categoria', 'categoria'],
                    ['ds_avaliacao', 'avaliacao'],
                    ['ds_produto', 'descricao'],
                    ['qtd_disponivel_estoque', 'estoque'],
                    ['ds_imagem', 'imagem']
                ] 
            });
        } else {
            produtos = await db.infod_ssc_produto.findAll({
                order: [[ 'id_produto', 'desc' ]] 
            });
        }

        resp.send(produtos);

    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})






app.get('/v2/produtos', async (req, resp) => {
    const produtos = await db.infod_ssc_produto.findAll({
      where: {
        [Op.or]: [
          { 'nm_produto':  { [Op.like]:      `%${req.query.filtro}%` } },
          { 'ds_produto':  { [Op.substring]:  `${req.query.filtro}` } }
        ]
      },
      attributes: [
        ['id_produto', 'id'],
        ['nm_produto', 'nome'],
        ['ds_produto', 'descricao'],
        ['vl_produto', 'preco']
      ]
    })
  
    resp.send(produtos);
});
  

app.get('/v3/produtos', async (req, resp) => {
    let page = req.query.page || 0;
    if (page <= 0) page = 1;

    const itemsPerPage = 6;
    const skipItems    = (page-1) * itemsPerPage;

    const produtos = await db.infod_ssc_produto.findAll({
        limit: itemsPerPage,
        offset: skipItems,
        order: [[ 'nm_produto', 'asc' ]],
        attributes: [
            ['id_produto', 'id'],
            ['nm_produto', 'produto'],
            ['ds_produto', 'descricao'],
            ['vl_produto', 'preco'],
            ['ds_produto', 'imagem']
        ]
    });

    const total = await db.infod_ssc_produto.findOne({
        raw: true,
        attributes: [
            [fn('count', 1), 'qtd']
        ]
        });

        resp.send({
        items: produtos,
        total: total.qtd,
        totalPaginas: Math.ceil(total.qtd/6),
        pagina: Number(page)
        });
})


// Produto

app.get('/pedido', async (req, resp) => {
    try {
        let r = await db.infod_ssc_pedido.findAll({
            order: [[ 'id_venda', 'asc' ]],
            attributes: [
                ['id_venda', 'id da venda'],
                ['id_item', 'id do item'],
                ['vl_pedido', 'valor do pedido'],
                ['dt_pedido', 'data do pedido'],
                ['ds_entregue', 'descricao da entrega'],
                ['ds_acaminho', 'descricao do caminho'],
                ['ds_preparando', 'descricao do preparo']
            ]
        });
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/pedido', async (req, resp) => {
    try {
        
        let { id_da_venda, id_do_item, valor_pedido, data_do_pedido, descricao_da_entrega, descricao_do_caminho, descricao_do_preparo } = req.body;
        let c = await db.infod_ssc_pedido.create(
         {
            
            id_venda: id_da_venda,
            id_item: id_do_item,
            vl_pedido: valor_pedido,
            dt_pedido: data_do_pedido,
            ds_entregue: descricao_da_entrega,
            ds_acaminho: descricao_do_caminho,
            ds_preparando: descricao_do_preparo        
         })

        resp.send(c);
    
    } catch(c) {
    resp.send({ erro: c.toString() })
    }
})

app.put('/pedido/:id', async (req, resp) => {
    try{
        let {   id_da_venda, id_do_item, valor_pedido, data_do_pedido, descricao_da_entrega, descricao_do_caminho, descricao_do_preparo} = req.body;
        let { id } = req.params;

        let b = await db.infod_ssc_pedido.update(
            {
                 
            id_venda: id_da_venda,
            id_item: id_do_item,
            vl_pedido: valor_pedido,
            dt_pedido: data_do_pedido,
            ds_entregue: descricao_da_entrega,
            ds_acaminho: descricao_do_caminho,
            ds_preparando: descricao_do_preparo
               
            },
            {
                where: { id_pedido: id }
            }
        )
        resp.sendStatus(200);
    } catch(b) {
        resp.send({ erro: b.toString() })
    }
})  

app.delete('/pedido/:id', async (req, resp) => {
    try {
        let { id } = req.params;
        let r = await db.infod_ssc_pedido.destroy({ where: { id_pedido: id } })
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})
// pedido

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
            ds_senha: crypto.SHA256(senha).toString(crypto.enc.Base64)
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

        if (email === "" && senha === "") {
            return resp.send({ erro: 'Preencha todos os campos!' });
        }

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

        if (nome === "" && email === "" && senha === "") {
            return resp.send({ erro: 'Preencha todos os campos!' });
        }

        if (email.includes('@')) {
            return resp.send('Ok')
        }

        let b = await db.infod_ssc_cliente.create({
            nm_cliente: nome,
            ds_email: email,
            ds_senha: crypto.SHA256(senha).toString(crypto.enc.Base64)
        })

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

app.get('/item', async (req, resp) => {
    try {
        let r = await db.infod_ssc_item.findAll({
            order: [[ 'vl_item', 'asc' ]],
            attributes: [
                ['id_produto', 'id_do_produto'],
                ['vl_item', 'valor'],
                ['qtd_produto', 'quantidade_do_produto']
            ]
        }); 
        resp.send(r);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.post('/item', async (req, resp) => {
    try {
        
        let { id_do_produto, valor, quantidade_do_produto} = req.body;

        let j = await db.infod_ssc_item.create({
            
            id_produto: id_do_produto,
            vl_item: valor,
            qtd_produto: quantidade_do_produto
           
        })
        resp.send(j);
    
    } catch(j) {
    resp.send({ erro: j.toString() })
    }
})

app.delete('/item/:id', async (req, resp) => {
    try {
        let { id } = req.params;
        let r = await db.infod_ssc_item.destroy({ where: { id_item: id } })
        resp.sendStatus(200);
    } catch (e) {
        resp.send({ erro: e.toString() })
    }
})

app.put('/item/:id', async (req, resp) => {
    try{
        let {  id_do_produto, valor, quantidade_do_produto } = req.body;
        let { id } = req.params;

        let b = await db.infod_ssc_item.update(
            {
                id_produto: id_do_produto,
                vl_item: valor,
                qtd_produto: quantidade_do_produto
                
            },
            {
                where: { id_item: id }
            }
        )
        resp.sendStatus(200);
    } catch(b) {
        resp.send({ erro: b.toString() })
    }
})  

//item


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
            x => console.log(`Subiu na lá na porta ${process.env.PORT}meu nobre`))