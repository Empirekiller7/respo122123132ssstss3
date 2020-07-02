var express = require("express");
var router = express.Router(); 

var Tag = require('../Models/Tag.js'); 

router.post('/', function (req, res) {  
    let newTag = Object.assign(new Tag(), req.body);
    newTag.save(msg => res.json(msg));
}); 

router.get('/', function (req, res) {     
    Tag.all(rows => res.send(JSON.stringify(rows, Object.keys(new Tag()).concat(["id"]))));
}); 
 
router.get('/:id', function (req, res) {  
     Tag.get(req.params.id , rows => res.json(rows));
}); 

router.get('/:model/:id', function (req, res) {     
    Tag.many(req.params.model, req.params.id, rows => res.send(JSON.parse(
            JSON.stringify(rows, Object.keys(new Tag()).concat(["id"])))));
  
}); 

router.put('/:id', function (req, res) {  
    Tag.get(req.params.id, function (row){
    let updatedTag = Object.assign(row, req.body)
    updatedTag.save(msg => res.json(msg));
    });     
}); 
 
router.delete('/:id', function (req, res) {     
    Tag.delete(req.params.id, rows => res.json(rows));
}); 


//Se existisse mais schemas deveriam aparecer aqui mais rotas para esses novos schemas 
 
module.exports = router; 