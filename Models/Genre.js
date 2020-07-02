//Ficheiro models/class.mustache
const schemaGenre = require('../schemas/Schema-Genre.json');
const jsf = require('json-schema-faker');
const faker = require('faker');
const path = require("path");
const dbRelativePath = path.resolve("./publish/Database", "labs.db");
var database = require('../Database/sqlite-wrapper.js')(dbRelativePath);
jsf.extend('faker', () => { return faker });


class Genre {
    constructor (name, id) {
        this.id = id;
           
this.name=name;

        Object.defineProperty(this, 'id', { enumerable: false });
        
    }

    static create(){
      return Object.assign(new Genre(), jsf.generate(schemaGenre));
    }

    static all(callback) { 
      database.where("SELECT * FROM  Genre ", [], Genre, callback);
    }

    static get(id, callback) {         
      database.get("SELECT * FROM Genre WHERE id = ?", [id], Genre, callback);
    }

    static delete(id, callback) {     
      database.run("DELETE FROM Genre WHERE id = ?", [id], callback);
    }

    static many(model, id, callback){
      let tablename = "Genre".localeCompare(model) === -1 ? "Genre_" + model : model + "_Genre";
      database.where(`SELECT Genre.*
                      FROM Genre
                      INNER JOIN ${tablename}
                      ON ${tablename}.Genre_id = Genre.id
                      WHERE ${tablename}.${model.toLowerCase()}_id = ?`, [id], Genre, callback); 
    }

    static top(property,order,limit,callback) {     
      database.where(`SELECT * FROM Genre ORDER BY ${property} ${order} LIMIT ${limit}`, [], Genre, callback); 
      }

    insertMM(relationClassId, thisClass, thisClassName, tableName){
        if(Array.isArray(thisClass[relationClassId.toString()])){
          thisClass[relationClassId].forEach((element) => {
            let query = "INSERT INTO "+ tableName+ " ("+ thisClassName.toLowerCase() + '_id, '+ relationClassId +") VALUES (?,?)";
            //TODO MAYBE EXEC
            database.run(query, [thisClass.id, element], null); 
          })
        }
    }

   

    save(callback) {    
        let thisGenre = this;

        if(this.id) { 
           database.run("UPDATE Genre SET name = ? where id = ?", [this.name, this.id], 
             function(msg){
              callback(msg);
           }.bind(this));     
        } else { 
        
          
          //TODO CHECK IF NECESSARY
          Object.defineProperty(thisGenre, 'id', { enumerable: true });

          database.run("INSERT INTO Genre (name) VALUES (?)", 
              [this.name], 
                (msg) => { 
                  thisGenre['id'] = msg.lastID;
                  callback(msg);
                  }); 

        
         
        } 
    }

}

module.exports = Genre;