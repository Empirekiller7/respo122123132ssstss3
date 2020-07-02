//Ficheiro models/class.mustache
const schemaTag = require('../schemas/Schema-Tag.json');
const jsf = require('json-schema-faker');
const faker = require('faker');
const path = require("path");
const dbRelativePath = path.resolve("./publish/Database", "labs.db");
var database = require('../Database/sqlite-wrapper.js')(dbRelativePath);
jsf.extend('faker', () => { return faker });


class Tag {
    constructor (name,description, id) {
        this.id = id;
           
this.name=name;
this.description=description;

        Object.defineProperty(this, 'id', { enumerable: false });
        Object.defineProperty(this, 'description', { enumerable: false });

    }

    static create(){
      return Object.assign(new Tag(), jsf.generate(schemaTag));
    }

    static all(callback) { 
      database.where("SELECT * FROM  Tag ", [], Tag, callback);
    }

    static get(id, callback) {         
      database.get("SELECT * FROM Tag WHERE id = ?", [id], Tag, callback);
    }

    static delete(id, callback) {     
      database.run("DELETE FROM Tag WHERE id = ?", [id], callback);
    }

    static many(model, id, callback){
      let tablename = "Tag".localeCompare(model) === -1 ? "Tag_" + model : model + "_Tag";
      database.where(`SELECT Tag.*
                      FROM Tag
                      INNER JOIN ${tablename}
                      ON ${tablename}.Tag_id = Tag.id
                      WHERE ${tablename}.${model.toLowerCase()}_id = ?`, [id], Tag, callback); 
    }

    static top(property,order,limit,callback) {     
      database.where(`SELECT * FROM Tag ORDER BY ${property} ${order} LIMIT ${limit}`, [], Tag, callback); 
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
        let thisTag = this;

        if(this.id) { 
           database.run("UPDATE Tag SET name = ?, description = ? where id = ?", [this.name, this.description, this.id], 
             function(msg){
              callback(msg);
           }.bind(this));     
        } else { 
        
          
          //TODO CHECK IF NECESSARY
          Object.defineProperty(thisTag, 'id', { enumerable: true });

          database.run("INSERT INTO Tag (name, description) VALUES (?,?)", 
              [this.name, this.description], 
                (msg) => { 
                  thisTag['id'] = msg.lastID;
                  callback(msg);
                  }); 

        
         
        } 
    }

}

module.exports = Tag;