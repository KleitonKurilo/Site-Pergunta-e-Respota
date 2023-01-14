
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require("./database/database.js")
const perguntaModel = require("./database/Perguntas.js")
const Pergunta = require('./database/Perguntas.js')
const Resposta = require('./database/Respostas.js')

connection.authenticate()
.then(() =>{
    console.log("Conexão realiazada com Banco de Dados")
})
.catch((msgError) =>{
    console.log(msgError)

})

app.set('view engine','ejs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

app.get('/',function(req,res){

    Pergunta.findAll({raw:true,  order:[

        ['id','DESC']

    ]}).then(perguntas=>{

        res.render("index",{
            perguntas:perguntas

        })
    })

    
})



app.get('/perguntar',function(req,res){
   
    res.render("perguntar")
    
})

app.get('/pergunta/:id',function(req,res){

    var id = req.params.id
    Pergunta.findOne({
        where:{id:id}
    }).then(pergunta=>{

        if(pergunta != undefined){

            Resposta.findAll({

                where: {perguntaId:pergunta.id}
            }).then(respostas=>{

                res.render("pergunta",{

                    pergunta:pergunta,
                    respostas:respostas
                })
            })
           
        }else{
            res.redirect("/")
        }
    })
 
    
})


app.post('/salvarpergunta',function(req,res){
    var titulo = req.body.titulo
    var descricao = req.body.descricao

    Pergunta.create({
        titulo:titulo,
        descricao:descricao

    }).then(()=>{
        res.redirect("/")
    })
})

app.post("/responder",(req,res)=>{

    var camporesposta= req.body.corpo 
    var camporespotaid=req.body.pergunta

    Resposta.create({

        corpo:camporesposta,
        perguntaId:camporespotaid
    }).then(()=>{
        res.redirect("/pergunta/"+camporespotaid)
        
    })

})

app.listen(3000,function(error){

    if(error){
        console.log("Ocorreu um erro ao iniciar Servidor")
    }
    else{
        console.log("Servidor Iniciado com Sucesso")
    }

})