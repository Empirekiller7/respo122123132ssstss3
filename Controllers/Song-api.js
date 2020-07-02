var express = require("express");
var router = express.Router(); 

var Song = require('../Models/Song.js'); 

router.post('/', function (req, res) {  
    let newSong = Object.assign(new Song(), req.body);
    newSong.save(msg => res.json(msg));
}); 

router.get('/', function (req, res) {     
    Song.all(rows => res.send(JSON.stringify(rows, Object.keys(new Song()).concat(["id"]))));
}); 
 
router.get('/:id', function (req, res) {  
     Song.get(req.params.id , rows => res.json(rows));
}); 

router.get('/:model/:id', function (req, res) {     
    Song.many(req.params.model, req.params.id, rows => res.send(JSON.parse(
            JSON.stringify(rows, Object.keys(new Song()).concat(["id"])))));
  
}); 

router.put('/:id', function (req, res) {  
    Song.get(req.params.id, function (row){
    let updatedSong = Object.assign(row, req.body)
    updatedSong.save(msg => res.json(msg));
    });     
}); 
 
router.delete('/:id', function (req, res) {     
    Song.delete(req.params.id, rows => res.json(rows));
}); 


//Se existisse mais schemas deveriam aparecer aqui mais rotas para esses novos schemas 
 
module.exports = router; 