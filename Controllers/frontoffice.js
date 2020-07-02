var express = require('express');
var router = express.Router()
let background = '#ea7575';
let configServerSchemas = [ 'Song',  'Genre' ];
var Song = require('../Models/Song.js')
var schemaSong = require('../../schemas/Schema-Song.json')
var Genre = require('../Models/Genre.js')
var schemaGenre = require('../../schemas/Schema-Genre.json')

router.get('/Song', function (req, res) {     
    Song.top('name', 'DESC', '3', function (rows) {         
        console.log(rows)         
        res.render('home', {             
            rows: rows.map(obj => {                 
                return {                     
                    properties: Object.keys(obj).map(key => {                         
                        return {                             
                            name: key,                             
                            value: obj[key]                         
                            }                     
                    })                 
                }             
            }),
            backgroundColor: background,
            schemas: configServerSchemas.map(s => {
                return {
                    name: s,
                    href: '/frontoffice/' + s
                }
            }),              
            columns: Object.keys(new Song()).map(key => {                 
                return {                     
                    name: key                 
                };             
            })         
        });     
    }); 
}); 
router.get('/Genre', function (req, res) {     
    Genre.top('name', 'DESC', '3', function (rows) {         
        console.log(rows)         
        res.render('home', {             
            rows: rows.map(obj => {                 
                return {                     
                    properties: Object.keys(obj).map(key => {                         
                        return {                             
                            name: key,                             
                            value: obj[key]                         
                            }                     
                    })                 
                }             
            }),
            backgroundColor: background,
            schemas: configServerSchemas.map(s => {
                return {
                    name: s,
                    href: '/frontoffice/' + s
                }
            }),              
            columns: Object.keys(new Genre()).map(key => {                 
                return {                     
                    name: key                 
                };             
            })         
        });     
    }); 
}); 

module.exports = router;

 