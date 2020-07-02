var express = require("express");
var router = express.Router(); 

var Genre = require('../Models/Genre.js'); 

router.post('/', function (req, res) {  
    let newGenre = Object.assign(new Genre(), req.body);
    newGenre.save(msg => res.json(msg));
}); 

router.get('/', function (req, res) {     
    Genre.all(rows => res.send(JSON.stringify(rows, Object.keys(new Genre()).concat(["id"]))));
}); 
 
router.get('/:id', function (req, res) {  
     Genre.get(req.params.id , rows => res.json(rows));
}); 

router.get('/:model/:id', function (req, res) {     
    Genre.many(req.params.model, req.params.id, rows => res.send(JSON.parse(
            JSON.stringify(rows, Object.keys(new Genre()).concat(["id"])))));
  
}); 

router.put('/:id', function (req, res) {  
    Genre.get(req.params.id, function (row){
    let updatedGenre = Object.assign(row, req.body)
    updatedGenre.save(msg => res.json(msg));
    });     
}); 
 
router.delete('/:id', function (req, res) {     
    Genre.delete(req.params.id, rows => res.json(rows));
}); 


//Se existisse mais schemas deveriam aparecer aqui mais rotas para esses novos schemas 
 
module.exports = router; 