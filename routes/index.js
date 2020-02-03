var express = require('express');
const { Sequelize, Datatypes } = require('sequelize');

const key = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'luca',
    password: 'root',
    database: 'mydb'
  }
});

const sequelize = new Sequelize('mydb','luca','root',{
  host: 'localhost',
  port : '5432',
  database : 'mydb',
  dialect: 'postgres'
})

var router = express.Router();

router.get('/', function(req, res, next) {

    var pointsAndRegions = new Array()

    key('regioes').select().then( data => {

      data.forEach( val => {

        pointsAndRegions.push(val)

      })
      return key('raios').select()

    }).then(

      data => {

        data.forEach(val => {

          pointsAndRegions.push(val)

        })

        res.render('index', { title: 'Express' , data : pointsAndRegions })

      }

    )

    /*key('raios').select()
    .then( data => {

      storedPoints = data
      console.log(storedPoints)

    }, err => { console.log(err)})

    //var pointsAndRegions = storedPoints.concat(storedPolygons)

    res.render('index', { title: 'Express' , data : pointsAndRegions });*/

});

router.post('/saveData',function(req,res,next){

    if(req.body.type == "regiao"){

      var polygon = JSON.stringify(req.body.data).replace(/\[/g,'(').replace(/\]/g,')');

      var nome = req.body.nome

      if(req.body.data.length >= 3){

        var insertPolygon = key('regioes').insert(key.raw(` (nome,regiao) values ('${nome}', polygon(path '${polygon}'))`))
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

      var insertPoints = key('raios').insert(key.raw(` (nome,raio) values ('${nome}', circle('${ponto}',${raio}))`))
      .then(res => { console.log(`Raio '${nome}'cadastrado com sucesso!`)}, err => { console.log('Erro no cadastro do raio')})

      //console.log(insertPoints)

    }

    res.sendStatus(200)

});

module.exports = router;
