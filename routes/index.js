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

    var storedPolygons = key('regioes').select().then( res => {

      console.log(res)

    } )

    var storedPoints = key('pontos').select().then( res => {

      console.log(res)

    } )

    console.log(storedPolygons.toString())

    var pointsAndRegions = [storedPoints,storedPolygons]

    res.render('index', { title: 'Express' , data : pointsAndRegions });

});

router.post('saveData',function(req,res,next){

    var polygon = JSON.stringify([[1.0,0.0],[1.0,1.0],[2.0,0.0],[2.0,1.0],[1.0,0.0]]).replace(/\[/g,'(');
    polygon = polygon.replace(/\]/g,')')

    console.log(polygon)

    var nome = 'regiao1'

    var insertPolygon = key('regioes').insert(key.raw(` (nome,regiao) values ('${nome}', polygon(path '${polygon}'))`)).then(

      ins => { console.log('inserted row')}, err => {console.log(err)}

    )

    console.log(insertPolygon.toString())

});

module.exports = router;
