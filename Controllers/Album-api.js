var express = require("express");
var router = express.Router(); 

var Album = require('../Models/Album.js'); 

router.post('/', function (req, res) {  
    let newAlbum = Object.assign(new Album(), req.body);
    newAlbum.save(msg => res.json(msg));
}); 

router.get('/', function (req, res) {     
    Album.all(rows => res.send(JSON.stringify(rows, Object.keys(new Album()).concat(["id"]))));
}); 
 
router.get('/:id', function (req, res) {  
     Album.get(req.params.id , rows => res.json(rows));
}); 

router.get('/:model/:id', function (req, res) {     
    Album.many(req.params.model, req.params.id, rows => res.send(JSON.parse(
            JSON.stringify(rows, Object.keys(new Album()).concat(["id"])))));
  
}); 

router.put('/:id', function (req, res) {  
    Album.get(req.params.id, function (row){
    let updatedAlbum = Object.assign(row, req.body)
    updatedAlbum.save(msg => res.json(msg));
    });     
}); 
 
router.delete('/:id', function (req, res) {     
    Album.delete(req.params.id, rows => res.json(rows));
}); 


//Se existisse mais schemas deveriam aparecer aqui mais rotas para esses novos schemas 
 
module.exports = router; 