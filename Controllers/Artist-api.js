var express = require("express");
var router = express.Router(); 

var Artist = require('../Models/Artist.js'); 

router.post('/', function (req, res) {  
    let newArtist = Object.assign(new Artist(), req.body);
    newArtist.save(msg => res.json(msg));
}); 

router.get('/', function (req, res) {     
    Artist.all(rows => res.send(JSON.stringify(rows, Object.keys(new Artist()).concat(["id"]))));
}); 
 
router.get('/:id', function (req, res) {  
     Artist.get(req.params.id , rows => res.json(rows));
}); 

router.get('/:model/:id', function (req, res) {     
    Artist.many(req.params.model, req.params.id, rows => res.send(JSON.parse(
            JSON.stringify(rows, Object.keys(new Artist()).concat(["id"])))));
  
}); 

router.put('/:id', function (req, res) {  
    Artist.get(req.params.id, function (row){
    let updatedArtist = Object.assign(row, req.body)
    updatedArtist.save(msg => res.json(msg));
    });     
}); 
 
router.delete('/:id', function (req, res) {     
    Artist.delete(req.params.id, rows => res.json(rows));
}); 


//Se existisse mais schemas deveriam aparecer aqui mais rotas para esses novos schemas 
 
module.exports = router; 