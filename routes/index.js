require('dotenv').config()
var express = require('express');
const { Sequelize, Datatypes } = require('sequelize');

const knex = require('knex')({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'mydb'
  }
});

var router = express.Router();

router.get('/', function(req, res, next) {

    res.render('default')
    /*var pointsAndRegions = new Array()

    knex('regioes').select().then( data => {

      data.forEach( val => {

        pointsAndRegions.push(val)

      })
      return knex('raios').select()

    }).then(

      data => {

        data.forEach(val => {

          pointsAndRegions.push(val)

        })

        console.log(pointsAndRegions)
        res.render('index', { title: 'Express' , data : pointsAndRegions })

      }

    )*/

});
router.post('/saveData',function(req,res,next){

    if(req.body.type == "regiao"){

      var polygon = JSON.stringify(req.body.data).replace(/\[/g,'(').replace(/\]/g,')');

      var nome = req.body.nome

      if(req.body.data.length >= 3){

        var insertPolygon = knex('regioes').insert(knex.raw(` (nome,regiao) values ('${nome}', polygon(path '${polygon}'))`))
        .then(
          res => {

            console.log(`Região '${nome}' inserida com sucesso!`)

          }, err => {

            console.log("Error")

          }
        );

        console.log(insertPolygon)

      }

    }else if(req.body.type == "pontos"){

      var ponto = JSON.stringify(req.body.data).replace(/\[/g,'(').replace(/\]/g,')');

      ponto = ponto.slice(1,ponto.length-1)

      //console.log(ponto.slice(1,ponto.length-1))

      var nome = req.body.nome

      var raio = req.body.raio

      var insertPoints = knex('raios').insert(knex.raw(` (nome,raio) values ('${nome}', circle('${ponto}',${raio}))`))
      .then(res => { console.log(`Raio '${nome}'cadastrado com sucesso!`)}, err => { console.log('Erro no cadastro do raio')})

      //console.log(insertPoints)

    }

    res.sendStatus(200)

});
router.get('/getRegioes',function(req,res,next){

    var regioes = new Array()

    knex('regioes').select().then(

      data => {

        data.forEach(val => {

          regioes.push(val)

        })

        res.json(regioes)

      }

    )

});
router.get('/getRaios',function(req,res,next){

  var raios = new Array()

  knex('raios').select().then(

    data => {

      data.forEach(val => {

        raios.push(val)

      })

      res.json(raios)

    }

  )

});
router.post('/saveRegiao',function(req,res,next){

  var nome  = req.body.nome

  var regiao = JSON.stringify(req.body.regiao).replace(/\[/g,'(').replace(/\]/g,')')
  regiao = regiao.slice(1,regiao.length-1)

  var query = knex('regioes').insert(knex.raw(` values ('${nome}',polygon(path '${regiao}')) `))
  .then(
    success => {
      console.log(`Região ${nome} inserida no banco`)
      res.json({msg : `Região ${nome} inserida no banco`})
    },
    err => {
      console.log(`Erro na inserção da região ${nome}`)
      res.json({msg : `Região ${nome} inserida no banco`})
    }
  )

  console.log(query)

});
router.post('/saveRaio',function(req,res,next){

  var nome = req.body.nome
  var raio = req.body.raio
  var ponto = JSON.stringify(req.body.ponto).replace(/\]/g,')').replace(/\[/g,'(')
  ponto = ponto.slice(1,ponto.length-1)

  var query = knex('raios').insert(knex.raw(` values ('${nome}', circle('${ponto}',${raio})) `)).then(

    success => {

      console.log(`Raio ${nome} salvo com sucesso!`)

      res.json({msg : `Raio ${nome} salvo com sucesso!`})

    },
    err => {

      console.log(`Erro no cadastro de raio ${nome}`)

      res.json({msg : `Erro no cadastro de raio ${nome}`})

    }

  )

});

module.exports = router;
